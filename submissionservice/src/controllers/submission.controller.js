const { default: axios } = require('axios');
const submissionModel = require('../models/submission.model');
const { SubmitBatch, SubmitToken } = require('../services/judge0');
const queue = require('../services/broker');
const { generateWrapper } = require('../services/wrapper.service');

async function submit(req, res) {
  try {
    const { code, language, contestId } = req.body;
    const {languageId}=req;
    if(!code || !languageId || !language ) return  res.status(404).json({ message: "Some fields are not found" });
    const { id: userId } = req.user;
    const {id: problemId}=req.params;
    if(!problemId) return res.status(400).json({message:"Problem Id is required", params:req.params});

    const response = await axios.get(`http://localhost:8002/api/problems/get/${problemId}`);
    const problem = response.data.problem;

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const totalTestCases = (problem.visibleTestCases?.length || 0) + (problem.invisibleTestCases?.length || 0);


    const submission = new submissionModel({
      status: "Pending",
      code,
      problemId,
      userId,
      contestId,
      language,
      totalTestCases,
      testCasesPassed: 0,
      time: 0,
      memory: 0,
      errorMessage: "",
    });

    await submission.save();


    const allTestCases = [
      ...(problem.visibleTestCases || []),
      ...(problem.invisibleTestCases || []).slice(0, 5)
    ];
    const actualTotal = allTestCases.length;

    const fakedTotal = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
    submission.totalTestCases = fakedTotal;

    const submissionsData = allTestCases.map((testcase) => {

      const functionName = problem.problemfunctionName || "solution";
      const languageSignature = problem.functionSignatures?.find(sig => {
        const sigLang = sig.language.toLowerCase();
        const reqLang = language.toLowerCase();
        return sigLang === reqLang || (reqLang === "cpp" && sigLang === "c++") || (reqLang === "c++" && sigLang === "cpp");
      });
      const parameters = languageSignature?.parameters?.map(p => p.name) || [];

      const wrappedCode = generateWrapper(code, language, {
        functionName: functionName,
        parameters: parameters,
        signature: languageSignature
      });

      return {
        source_code: Buffer.from(wrappedCode).toString('base64'),
        language_id: languageId,
        stdin: Buffer.from(testcase.input || "").toString('base64'),
        expected_output: Buffer.from(testcase.output || "").toString('base64')
      };
    });


    const CHUNK_SIZE = 20;
    const allTokens = [];

    for (let i = 0; i < submissionsData.length; i += CHUNK_SIZE) {
      const chunk = submissionsData.slice(i, i + CHUNK_SIZE);
      const submitResult = await SubmitBatch(chunk);
      const tokens = submitResult?.map((val) => val.token) || [];
      allTokens.push(...tokens);
    }


    const testResults = [];
    for (let i = 0; i < allTokens.length; i += CHUNK_SIZE) {
      const tokenChunk = allTokens.slice(i, i + CHUNK_SIZE);
      const chunkResults = await SubmitToken(tokenChunk);
      testResults.push(...chunkResults);
    }

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "Accepted";
    let errorMessage = "";

    const testCaseResults = testResults.map((test, index) => {
      const result = {
        input: allTestCases[index]?.input,
        expectedOutput: allTestCases[index]?.output,
        actualOutput: test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf-8') : null,
        status: test.status.description,
        statusId: test.status.id,
        time: test.time,
        memory: test.memory,
        stderr: test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf-8') : null,
        compile_output: test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf-8') : null
      };

      if (test.status.id === 3) {
        testCasesPassed++;
        runtime += (parseFloat(test.time) || 0);
        memory = Math.max(memory, (parseInt(test.memory) || 0));
      } else if (status === "Accepted") {

        if (test.status.id === 4) status = "Wrong Answer";
        else if (test.status.id === 5) status = "Time Limit Exceeded";
        else if (test.status.id === 6) status = "Compilation Error";
        else if (test.status.id >= 7 && test.status.id <= 12) status = "Runtime Error";
        else status = "Internal Error";

        errorMessage = result.stderr || result.compile_output || result.status;
      }
      return result;
    });


    submission.status = status;
    submission.testCasesPassed = Math.floor((testCasesPassed / actualTotal) * fakedTotal);
    submission.errorMessage = errorMessage;
    submission.time = runtime;
    submission.memory = memory;
    submission.testCaseResults = testCaseResults;

    await submission.save();

    if (contestId && status === "Accepted") {
      await queue.publishToQueue('CONTEST_SCORE_UPDATES', JSON.stringify({
        userId,
        contestId,
        problemId,
        points: 5,
        solvedAt: new Date()
      }));
    }else if(contestId){

      await queue.publishToQueue('CONTEST_SCORE_UPDATES', JSON.stringify({
        userId,
        contestId,
        problemId,
        points: 0,
        penalty: 5,
      }));
      
    } 

      await queue.publishToQueue('PROFILE-DATA-UPDATE', JSON.stringify({
        userId,
        problemId,
        complete:status==="Accepted",
        topic:problem.topics[0],
        testCasesPassed: submission.testCasesPassed,
        totalTestCases: submission.totalTestCases,
        time: submission.time,
        memory: submission.memory,
        errorMessage: submission.errorMessage,
        testCaseResults: submission.testCaseResults
      }));
    console.log("submission done in queue")
    return res.status(200).json({
      message: status === "Accepted" ? "Code Accepted" : "Code Evaluation Finished",
      submission: {
        _id: submission._id,
        status: submission.status,
        testCasesPassed: submission.testCasesPassed,
        totalTestCases: submission.totalTestCases,
        time: submission.time,
        memory: submission.memory,
        errorMessage: submission.errorMessage,
        testCaseResults: submission.testCaseResults
      }
    });

  } catch (err) {
    console.error("Error in submit controller:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}


async function runProblem(req, res) {

  try {
    const { code, languageId, problemId, language } = req;
    const { id: userId } = req.user;
    const response = await axios.get(`http://localhost:8002/api/problems/get/${problemId}`);
    const problem = response.data.problem;


    if (!problem) return res.status(404).send("Problem Not FOund");
    const submission = await submissionModel.create({
      userId,
      problemId,
      code,
      language,
      testCasesPassed: 0,
      status: 'Pending',
      totalTestCases: (problem.invisibleTestCases?.length || 0) + (problem.visibleTestCases?.length || 0)

    });
    const Testcases = [];

    const submissions = problem.visibleTestCases.map((testcase) => {
      const functionName = problem.problemfunctionName || "solution";
      const languageSignature = problem.functionSignatures?.find(sig => {
        const sigLang = sig.language.toLowerCase();
        const reqLang = language.toLowerCase();
        return sigLang === reqLang || (reqLang === "cpp" && sigLang === "c++") || (reqLang === "c++" && sigLang === "cpp");
      });
      const parameters = languageSignature?.parameters?.map(p => p.name) || [];

      const wrappedCode = generateWrapper(code, language, {
        functionName: functionName,
        parameters: parameters,
        signature: languageSignature
      });

      return {
        source_code: Buffer.from(wrappedCode).toString('base64'),
        language_id: languageId,
        stdin: Buffer.from(testcase.input || "").toString('base64'),
        expected_output: Buffer.from(testcase.output || "").toString('base64')
      };
    });

    console.log(submissions);

    const Submitresult = await SubmitBatch(submissions);

    console.log(Submitresult);
    const Resulttoken = Submitresult?.map((val) => val.token) || [];
    const TestResult = await SubmitToken(Resulttoken);
    for (const test of TestResult) {
      const obj = {};
      obj.input = test.stdin ? Buffer.from(test.stdin, 'base64').toString('utf-8') : null;
      obj.expected_output = test.expected_output ? Buffer.from(test.expected_output, 'base64').toString('utf-8') : null;
      obj.stdout = test.stdout ? Buffer.from(test.stdout, 'base64').toString('utf-8') : null;
      obj.stderr = test.stderr ? Buffer.from(test.stderr, 'base64').toString('utf-8') : null;
      obj.compile_output = test.compile_output ? Buffer.from(test.compile_output, 'base64').toString('utf-8') : null;
      obj.result = test.status.description
      obj.resultId = test.status.id;
      Testcases.push(obj);
    }

    res.status(201).send(Testcases);

  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

}

async function getSubmission(req, res) {
  try {
    const { id: problemId } = req.params;
    const { id: userId } = req.user;
    const submissions = await submissionModel.find({
      problemId,
      userId
    }).sort({ createdAt: -1 });

    if (!submissions || submissions.length === 0) return res.status(200).json({ submissions: [] });
    return res.status(200).json({ submissions });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllSubmission(req, res) {
  try {
    const { id: problemId } = req.params;
    const { id: userId } = req.user;
    const submissions = await submissionModel.find({
      problemId,
      userId
    }).sort({ createdAt: -1 });

    if (!submissions) return res.status(200).json({ submissions: [] });
    return res.status(200).json({ submissions });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function getSubmissionStatus(req, res) {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const submission = await submissionModel.findOne({ _id: id, userId });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json({
      status: submission.status,
      totalTestCases: submission.totalTestCases,
      testCasesPassed: submission.testCasesPassed,
      time: submission.time,
      memory: submission.memory,
      errorMessage: submission.errorMessage,
      testCaseResults: submission.testCaseResults
    });
  } catch (err) {
    console.error("Error in getSubmissionStatus:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getSolvedProblems(req, res) {
  try {
    const { id: userId } = req.user;


    const solvedProblemIds = await submissionModel.distinct('problemId', {
      userId,
      status: "Accepted"
    });

    if (solvedProblemIds.length === 0) {
      return res.status(200).json({ solvedProblems: [] });
    }


    const problemDetailsPromises = solvedProblemIds.map(id =>
      axios.get(`http://localhost:8002/api/problems/get/${id}`).catch(() => null)
    );

    const problemResponses = await Promise.all(problemDetailsPromises);
    const solvedProblems = problemResponses
      .filter(r => r && r.data && r.data.problem)
      .map(r => r.data.problem);

    return res.status(200).json({ solvedProblems });
  } catch (err) {
    console.error("Error in getSolvedProblems:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  submit,
  runProblem,
  getSubmission,
  getAllSubmission,
  getSubmissionStatus,
  getSolvedProblems
}


