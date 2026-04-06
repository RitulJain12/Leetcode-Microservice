const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const { ChatGroq } = require("@langchain/groq");
const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: 0.5,
});
const axios = require("axios");

const findproblembyID = tool(async (args) => {
    const { pid } = args;

    const response = await axios.get(`http://localhost:8002/api/problems/get/${pid}`);
    console.log(response.data.problem)
 //   console.log(response.data)
    const problem =  {
        
            title: response.data.problem.title,
            description: response.data.problem.description,
            problemfunctionName: response.data.problem.problemfunctionName,
            functionSignatures: response.data.problem.functionSignatures,
    
    }

    return JSON.stringify(problem)

}, {
    name: "findproblembyID",
    description: "use this tool to find the problem by its id so the model will fix it",
    schema: z.object({
        pid: z.string().describe("The id of problem  to find")
    })
})

module.exports = {
    findproblembyID
}