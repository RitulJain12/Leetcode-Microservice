const mongoose = require('mongoose');
const msgqueue = require('../services/broker');
const profileModel = require('../models/profile.model');

async function createProfile(data) {

  try {
    console.log(`data is ${data}`)
    const { id, email, name } = data;
    const profile = await profileModel.create({
      user: id,
      email,
      name
    })

  }
  catch (err) {
    console.log(`Error in Profile Creation :${err.message}`);
  }

}

async function getProfileById(req, res) {
  const { id } = req.params;

  if (!id || id === 'undefined') {
    return res.status(400).json({ message: "Invalid or missing User ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const profile = await profileModel.findOne({
      user: id,
    })
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({
      message: "Success",
      profile: [profile]
    })
  }
  catch (err) {
    console.error(`Error in getProfileById for ID [${id}]:`, err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}

async function updateProfile(req, res) {
  try {

    const { updates } = req;
    console.log(updates);
    const profile = await profileModel.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true }
    );

    return res.json({
      success: true,
      data: profile
    });
  }

  catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }


}

async function updateSubmissions(data) {

  try {
    const {
      userId, problemId, complete, topic, status
    } = data;
    console.log(data);

    const profile = await profileModel.findOne({ user: userId });
    if (!profile) return res.status(500).json({ message: "Internal Server Error" });
    profile.totalsubmissions += 1;
    profile.lastactive = new Date();

    if (complete) {
      if (!profile.recentActivity.includes(problemId)) {
        profile.recentActivity.push(problemId);
      }
      if (profile.recentActivity.length > 10) {
        profile.recentActivity.shift();
      }


       if(!profile.topicsSolved.includes(data.topic)){
          profile.topicsSolved.push(data.topic);
       }
      profile.problemsSolved += 1;


    }
    profile.totalsubmissions += 1;

    const today = new Date();
    const activeday = profile.activedays.find((day) => day.date.toDateString() === today.toDateString());
    if (activeday) {
      activeday.submissions += 1;
    } else {
      profile.activedays.push({
        date: today,
        submissions: 1
      })
    }


    await profile.save();
    console.log("Profile updated successfully", profile);

  }
  catch (err) {

    console.log(err.message);
  }

}



module.exports = {
  createProfile,
  getProfileById,
  updateProfile,
  updateSubmissions
}