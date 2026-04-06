const path = require('path');
const mongoose = require('mongoose');

// AI Model
const aiSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

// Problem Schema
const problemSchema = new mongoose.Schema({
    title: String
});

const faqData = [
    {
        problemTitle: "Two Sum",
        faqs: [
            { question: "Hint", answer: "Use a hash map to store the elements you've already seen. For each element `x`, check if `target - x` exists in the map." },
            { question: "Solution", answer: "The optimal solution uses a single pass with a Hash Map. Check for the complement (`target - nums[i]`) while iterating." },
            { question: "Complexity", answer: "Time Complexity: O(n). Space Complexity: O(n)." }
        ]
    },
    {
        problemTitle: "Palindrome Number",
        faqs: [
            { question: "Hint", answer: "Try reversing the second half of the number and comparing it with the first half." },
            { question: "Solution", answer: "Reverse the integer mathematically (using % 10 and / 10) and compare it to the original." },
            { question: "Complexity", answer: "Time Complexity: O(log₁₀(n)). Space Complexity: O(1)." }
        ]
    },
    {
        problemTitle: "Valid Parentheses",
        faqs: [
            { question: "Hint", answer: "Parentheses follow a LIFO pattern. Use a stack." },
            { question: "Solution", answer: "Push opening brackets onto a stack. For closing brackets, pop the top and check for a match." },
            { question: "Complexity", answer: "Time Complexity: O(n). Space Complexity: O(n)." }
        ]
    },
    {
        problemTitle: "Merge Two Sorted Lists",
        faqs: [
            { question: "Hint", answer: "Use a dummy node to simplify the head of the new list." },
            { question: "Solution", answer: "Iterate through both lists, picking the smaller valve until one is exhausted, then append the remainder." },
            { question: "Complexity", answer: "Time Complexity: O(n + m). Space Complexity: O(1)." }
        ]
    },
    {
        problemTitle: "Reverse String",
        faqs: [
            { question: "Hint", answer: "Use two pointers starting at both ends." },
            { question: "Solution", answer: "Swap elements at left and right pointers, then move them inward." },
            { question: "Complexity", answer: "Time Complexity: O(n). Space Complexity: O(1)." }
        ]
    }
];

async function run() {
    try {
        // 1. Fetch Problem IDs
        console.log("Connecting to Problem Service DB...");
        require('dotenv').config({ path: path.join(__dirname, '../../../problemService/.env'), override: true });
        const probUri = process.env.Mongo_uri;

        await mongoose.connect(probUri);
        const Problem = mongoose.model('Problem', problemSchema);
        const allProblems = await Problem.find({}, 'title _id');
        console.log(`Found ${allProblems.length} problems total.`);
        await mongoose.disconnect();

        // 2. Insert FAQs
        console.log("Connecting to AI Service DB...");
        require('dotenv').config({ path: path.join(__dirname, '../../.env'), override: true });
        const aiUri = process.env.Mongo_uri;

        await mongoose.connect(aiUri);
        // Delete the model if it was already compiled to avoid conflicts in tests, 
        // but here we are in a fresh process so it's fine.
        const Aimodel = mongoose.model('Aimodel', aiSchema);

        let count = 0;
        for (const data of faqData) {
            const prob = allProblems.find(p => p.title.toLowerCase() === data.problemTitle.toLowerCase());
            if (prob) {
                for (const f of data.faqs) {
                    await Aimodel.findOneAndUpdate(
                        { problemId: prob._id, question: f.question },
                        { answer: f.answer, problemId: prob._id },
                        { upsert: true }
                    );
                    count++;
                }
                console.log(`✅ Seeded: ${data.problemTitle}`);
            } else {
                console.log(`❌ Not found: ${data.problemTitle}`);
            }
        }

        console.log(`Successfully seeded ${count} FAQ entries.`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("FATAL ERROR:", err.message);
        process.exit(1);
    }
}

run();
