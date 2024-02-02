const utilities = require(".")
const { body, validationResult } = require("express-validator")
const valid = {}
const inventoryModel = require("../models/inventory-model")

/* ********************************************
 * Registration Data Validation Rules
 * ********************************************/
valid.newClassRules = () => {
    return [
        //classification_name is required and must be string
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid classification.") // on error this message is sent
        .custom(async (classification_name) => {
            const classExists = await inventoryModel.checkClassification(classification_name)
            if (classExists){
                throw new Error("Classification already exists.  Please try a different one.")
            }
        }),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ******************************/
valid.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./add-classification", {
            errors,
            title: "New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = valid