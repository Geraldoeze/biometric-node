const { validationResult } = require("express-validator");
const { getDb } = require("../../database/mongoConnect");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const User = require("../../models/user");

exports.getAllUsers = async (req, res, next) => {
  try {
    // fetch all users from db
  const allUsers = await User.getAllUsers();
  res.status(200).json({ message: "Users gotten", response: allUsers});
  }  catch (err) {
    res.status(501).json({message: "Getting Users Failed.!! "  })
  }
};


exports.createUser = async (req, res, next) => {
  const db = await getDb();

  // Verify all User inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res
      .status(422)
      .json({
        errors: errors.array(),
        message: "Check your Inputs. Try Again",
        statusId: "INVALID INPUTS",
      });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      gender,
      studentId,
      id,
      origin,
      department,
      courses,
      address,
      atClass
    } = req.body;

    //   Check if RegId  exist
    const _regUser = await db
      .collection("users")
      .findOne({ studentId: studentId });

    if (_regUser) {
      //  A user exists with this RegId,
      res.status(400).json({
        statusId: "STUDENT ID",
        message: "Student ID exists already, change it. !!!",
      });
    }

    // save user data to user database model
    const UserData = new User(
      firstName,
      lastName,
      email,
      gender,
      id,
      studentId,
      origin,
      department,
      courses,
      address,
      atClass
    );
    const saveUserData = await UserData.saveToDB();

    res.status(201).json({ message: "Users Created", response: saveUserData });
  } catch (err) {
    console.log(err);
  }
};


exports.findUserbyId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId)
  try {
    // find user from db
  const user = await User.findById(userId);
  res.status(200).json({ message: "User gotten", response: user});
  }  catch (err) {
    res.status(501).json({message: "Getting Users Failed.!! "  })
  }
}