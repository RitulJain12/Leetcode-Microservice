const Aimodel = require('../models/ai.model')
const axios = require('axios')

function cleanJson(text) {
    // Remove trailing commas in objects and arrays
    return text.replace(/,\s*([\]}])/g, '$1');
}

async function createFAQ(req, res) {
    try {
        const { question, answer, problemId } = req.body;
        const faq = new Aimodel({
            question,
            answer,
            problemId
        })
        await faq.save();
        res.status(201).json({ success: true, faq })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

async function question(req, res) {
    try {
        const { id } = req.params;
        const { question } = req.body;
        console.log(id, question);
        const faq = await Aimodel.findOne({ problemId: id, question });
        console.log(faq);
        if (!faq) {
            return res.status(404).json({ success: false, message: "FAQ not found" })
        }
        res.status(200).json({ success: true, ans: faq.answer })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

}

async function contestquestions(req, res) {
    try {

        const { ChatGroq } = require("@langchain/groq");
        const { SystemMessage, HumanMessage } = require("@langchain/core/messages");


        let existingTitles = [];
        try {
            const probRes = await axios.get("http://localhost:8002/api/problems/getall?limit=1000");
            if (probRes.data && probRes.data.problems) {
                existingTitles = probRes.data.problems.map(p => p.title);
            }
        } catch (fetchErr) {
            console.warn("Could not fetch existing problems for uniqueness check:", fetchErr.message);
        }

        const model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "openai/gpt-oss-120b",
            temperature: 0.7,
            maxTokens: 8192,
        });

        const prompt = `You are an expert competitive programming problem setter.
Generate 4 unique programming problems: 1 'Easy', 2 'Medium', 1 'Hard'.

CRITICAL: 
1. DO NOT reuse these existing titles: ${existingTitles.length > 0 ? JSON.stringify(existingTitles) : "None"}.
2. Output MUST be ONLY a VALID JSON ARRAY of 4 objects.
3. NO trailing commas in lists or objects.
4. Each object MUST include:
   - "title": string
   - "difficulty": "Easy", "Medium", or "Hard"
   - "points": number (5, 10, or 20)
   - "penalty": number (default 2)
   - "description": string
   - "hints": array of strings (at least 1)
   - "topics": array of strings (e.g., ["Strings", "DP"])
   - "companies": array of strings (e.g., ["Google", "Amazon"])
   - "problemfunctionName": camelCase string for the function name
   - "signature": { "js": "...", "py": "...", "java": "...", "cpp": "..." }
   - "boilerplate": { "js": "...", "py": "...", "java": "...", "cpp": "..." }
   - "referenceSolution": { "js": "...", "py": "...", "java": "...", "cpp": "..." }
   - "testCases": array of objects: { "input": "string", "output": "string", "explanation": "string" }
   - "invisibleTestCases": array of objects: { "input": "string", "output": "string" } (at least 2)
5. Keep all text fields CONCISE.
6. Test cases input/output must be strings (use JSON.stringify for complex types).
7. Output the JSON array directly without markdown wrappers.`;

        const result = await model.invoke([
            new SystemMessage(prompt),
            new HumanMessage("Generate the 4 novel contest questions now.")
        ]);

        let questions;
        try {
            let rawContent = result.content.trim();
            const startIndex = rawContent.indexOf('[');
            const endIndex = rawContent.lastIndexOf(']');

            if (startIndex === -1 || endIndex === -1) {
                throw new Error("No JSON array found in AI response");
            }

            let jsonString = rawContent.substring(startIndex, endIndex + 1);

            // Clean the JSON string (remove trailing commas, etc.)
            jsonString = cleanJson(jsonString);

            questions = JSON.parse(jsonString);

            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error("AI response is not a valid non-empty array");
            }
        } catch (parseError) {
            console.error("Failed to parse LLM Output:", result.content);
            console.error("Parse Error Details:", parseError.message);
            return res.status(500).json({
                success: false,
                message: "AI generated invalid JSON structure. Check logs for details."
            });
        }

        res.status(200).json({ success: true, questions: questions });
    } catch (err) {
        console.error("Contest Generation Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { createFAQ, question, contestquestions };