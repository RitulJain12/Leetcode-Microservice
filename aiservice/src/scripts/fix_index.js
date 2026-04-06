const path = require('path');
const mongoose = require('mongoose');

async function fixIndex() {
    try {
        console.log("Connecting to AI Service DB...");
        require('dotenv').config({ path: path.join(__dirname, '../../.env'), override: true });
        await mongoose.connect(process.env.Mongo_uri);

        const collection = mongoose.connection.collection('aimodels');
        console.log("Checking indexes...");
        const indexes = await collection.indexes();
        console.log("Current indexes:", indexes.map(i => i.name));

        if (indexes.some(i => i.name === 'question_1')) {
            console.log("Dropping index 'question_1'...");
            await collection.dropIndex('question_1');
            console.log("Index dropped.");
        } else {
            console.log("No 'question_1' index found.");
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err.message);
        process.exit(1);
    }
}

fixIndex();
