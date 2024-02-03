// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to process registration activity
router.post("/register", 
regValidate.registrationRules(),
regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post("/login", 
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router