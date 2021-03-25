
var express = require('express');
var userCtl = require('../controllers/user.controller');

const router = new express.Router();

router.route("/getTokenUser").get(userCtl.getTokenUser);
router.route("/initReg").post(userCtl.initialRegistration);
router.route("/updateUserByToken").post(userCtl.updateUserByToken);
router.route("/updateUserAddressByToken").post(userCtl.updateUserAddressByToken);
router.route("/getAddressByToken").get(userCtl.getAddressByToken);
router.route("/deleteUserToken").delete(userCtl.deleteUserToken);

module.exports = router;