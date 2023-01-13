const { getDb } = require("../../database/mongoConnect");

require("dotenv").config();
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

// POST departments
exports.createData = async (req, res, next) => {
  const db = getDb();
  const { department, courses } = req.body;

  // check if Department exist
  const reg_Data = await db
    .collection("userData")
    .findOne({ department: department });
  if (reg_Data) {
    return res.status(400).json({
      message: "Department already exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }
  const new_Item = { department, courses };
  try {
    const send_Data = await db.collection("userData").insertOne(new_Item);
    console.log(send_Data);
    res.status(201).json({ message: "Content Added", statusId: "SUCCESS" });
  } catch (err) {
    console.log(err);
  }
};

exports.getDepartment = async (req, res, next) => {
  const db = getDb();
  try {
    // fetch all department from db
    const deptList = await db.collection("userData").find().toArray();
    const listData = await deptList;
    res.status(200).json({ message: "Departments gotten", response: listData });
  } catch (err) {
    res.status(501).json({ message: "Getting Departments Failed.! " });
  }
};

// Edit Departments
exports.editDept = async (req, res, next) => {
  const updateValues = req.body;
  const id = req.params.uid;
  const db = getDb();

  // check if department exist
  const checkUser = await db
    .collection("userData")
    .findOne({ _id: new mongodb.ObjectId(id) });

  if (!checkUser) {
    return res.status(400).json({
      message: " This Department does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }
  try {
    const sendUpdate = await db
      .collection("userData")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { ...updateValues } }
      );
    console.log(sendUpdate);
    res.status(200).json({ message: "Department Updated", statusId: "GOOD" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred", statusId: "FAILED" });
  }
};

// delete department
exports.deleteDepartment = async (req, res, next) => {
  const id = req.params.uid;
  const db = getDb();
  try {
    await db.collection("userData").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "Removed Department" });
  } catch (err) {
    res.status(500).json({ message: "Delete Error", statusId: "SERVER ERROR" });
  }
};

exports.updateUser = async (req, res, next) => {
  const updateValues = req.body;
  const id = req.params.uid;
  const db = getDb();

  // check if user exists
  const checkUser = await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(id) });

  if (!checkUser) {
    return res.status(400).json({
      message: " User Id does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }

  try {
    const sendUpdate = await db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { ...updateValues } }
      );
    console.log(sendUpdate);
    res.status(200).json({ message: "Users Updated", statusId: "GOOD" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An Error Occurred", statusId: "FAILED" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.uid;
  const db = getDb();
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete User Error", statusId: "SERVER ERROR" });
  }
};

exports.getUserbyId = async (req, res, next) => {
  const db = getDb();

  const userId = req.params.uid;
  const { department, course } = req.body;

  // first check if userId exist on our db
  const checkUser = await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(userId) });

  if (!checkUser) {
    return res.status(400).json({
      message: " User Id does not exists.!",
      statusId: "UNSUCCESSFUL",
    });
  }

  // Second we check if user registered the department
  if (checkUser?.department === department) {
    // He/She has this department registered in db
    // we update the attendance db to have this user details

    try {
      const attendanceList = await db
        .collection("attendance")
        .findOne({ course: course });
      if (!attendanceList) {
        return res
          .status(400)
          .json({
            message: "This course is not registered on the database",
            statusId: "COURSE ERROR",
          });
      }

      // Check if the user has taken attendance already

      const checkUse = await db
        .collection("attendance")
        .find({ _id: attendanceList._id, attendance: { $in: [checkUser] } })
        .count();
      if (checkUse >= 1) {
        return res.status(400).json({
          message: "Student has already taken attendance",
          statusId: "WRONG",
        });
      }
      try {
        const id = attendanceList._id;
        const attendanceUpdate = [...attendanceList.attendance, checkUser];
        await db
          .collection("attendance")
          .updateOne(
            { _id: new mongodb.ObjectId(id) },
            { $set: { attendance: attendanceUpdate } }
          );
        
        res.status(200).json({
          message: "User Attendance Recorded",
          statusId: "CONFIRMED",
          response: checkUser,
        });
      } catch (err) {
        res.status(400).json({
          message: "Error while recording attendance",
          statusId: "FAILED",
        });
      }

     
    } catch (err) {
      console.log(err);
    }
  } else {
    return res
      .status(400)
      .json({
        message: "Student did not register this department",
        statusId: "WRONG",
      });
  }
};
 