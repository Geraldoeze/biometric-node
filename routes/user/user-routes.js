const express = require('express');
const userControllers = require('../../controllers/user/user-controllers');
const { check } = require("express-validator");

const router = express.Router();

router.get("/", userControllers.getAllUsers);

router.get("/getUser/:uid", userControllers.findUserbyId)

router.post("/create",
    
    userControllers.createUser
);



module.exports = router;