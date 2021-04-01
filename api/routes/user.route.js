
var express = require('express');
var userCtl = require('../controllers/user.controller');

const router = new express.Router();

router.route("/getTokenUser").get(userCtl.getTokenUser);
router.route("/checkSession").get(userCtl.checkSession);
router.route("/initReg").post(userCtl.initialRegistration);
router.route("/userSignin").post(userCtl.userSignin);
router.route("/updateUserByToken").post(userCtl.updateUserByToken);
router.route("/getAddressByToken").get(userCtl.getAddressByToken);
router.route("/deleteUserToken").delete(userCtl.deleteUserToken);
router.route("/updateUserAddressByToken").put(userCtl.updateUserAddressByToken);
router.route("/updateUserStatusByToken").put(userCtl.updateUserStatusByToken);

module.exports = router;