const express = require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js")

router.route("/signup")
.get( userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get( userController.renderLoginForm)
.post(
    saveRedirectUrl,//by using this middleware when we loggin for any thing then it will open this page directly as login for add listing then after login it will automatically open page
    passport.authenticate("local",{failureRedirect:'/login', failureFlash:true }),
    userController.login
);

router.get("/logout",userController.logout)
module.exports=router;