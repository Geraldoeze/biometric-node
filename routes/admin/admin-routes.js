const express = require('express');
const adminControllers = require('../../controllers/admin/admin-controllers');
const {validateUserUpdate} = require('../../middleware/userValidation');

const router = express.Router();



router.post("/createData", adminControllers.createData);

router.put("/update/:uid", validateUserUpdate, adminControllers.updateUser);

router.delete("/delete/:uid", adminControllers.deleteUser);


module.exports = router;