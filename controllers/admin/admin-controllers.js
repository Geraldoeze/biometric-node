
const { getDb } = require("../../database/mongoConnect");

require("dotenv").config();
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;


exports.createData = async (req, res, next) => {
  const db = getDb();
  const { department, courses, totalClasses } = req.body;

  // check if Department exist
  const reg_Data = await db
    .collection("userData")
    .findOne({ department: department });
  if (reg_Data) {
    return res.status(400).json({message: "Department already exists.!", statusId:'UNSUCCESSFUL'});
  }
  const new_Item = {department, courses, totalClasses}
  try {
    const send_Data = await db.collection('userData').insertOne(new_Item);
    console.log(send_Data);
    res.status(201).json({message: 'Content Added', statusId: 'SUCCESS'})
  } catch (err) {
    console.log(err)
  }
}


exports.updateUser = async (req, res, next) => {
  
  const updateValues = req.body;
  const id = req.params.uid;
  const db = getDb();
  
  // check if user exists
  const checkUser = await db
    .collection("users")
    .findOne({ _id: new mongodb.ObjectId(id) });
  
  if (!checkUser) {
    return res.status(400).json({message: " User Id does not exists.!", statusId:'UNSUCCESSFUL'});
  }
   
  try {  
    const sendUpdate = await db.collection('users').updateOne({_id: new mongodb.ObjectId(id) }, {$set: {...updateValues}});
    console.log(sendUpdate)
    res.status(200).json({ message: "Users Updated", statusId: "GOOD"});
  } catch (err) {console.log(err)}
  
};


exports.deleteUser = async (req, res, next) => {
  const id = req.params.uid;
  const db = getDb();
  try {
    await db.collection('user').deleteOne({_id: new ObjectId(id)})
    res.status(200).json({ message: "Users deleted" });
  } catch (err) {
    res.status(500).json({message: "Delete User Error", statusId: 'SERVER ERROR'})
  }
  
};