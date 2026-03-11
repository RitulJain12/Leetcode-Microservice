const validator = require('validator');
async function contestValidation(req, res, next) {

    try {
        console.log(req.body);
        const { name, description, startTime, endTime, duration, contesturl, contestTotalPoints } = req.body;
        if (!name || typeof name !== 'string' || !validator.isLength(name, { min: 3 })) return res.status(400).json({ message: "Name is required and must be at least 3 characters long or not valid" });

        if (!description) return res.status(400).json({ message: "Description is required" });

        if (!startTime) return res.status(400).json({ message: "Start time is required" });

        if (!endTime) return res.status(400).json({ message: "End time is required" });

        if (!duration) return res.status(400).json({ message: "Duration is required" });

        if (!contestTotalPoints) return res.status(400).json({ message: "Contest total points is required" });

        if (!contesturl || typeof contesturl !== 'string') return res.status(400).json({ message: "Contest URL is required" });
        console.log("kokoska");

        next();

    } catch (error) {

    }
}


module.exports = { contestValidation };