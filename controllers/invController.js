const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* **************************************************
 * Build inventory by classification view
 * ************************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* **************************************************
 * Build inventory by single vehicle view
 * ************************************************** */
invCont.buildByVehicleId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const response = await invModel.getInventoryByInventoryId(inv_id)
    const buildArea = await utilities.buildVehicleInfo(response)
    let nav = await utilities.getNav()
    const vehicleName = response[0].inv_year + ' ' + response[0].inv_make +' ' + response[0].inv_model
    res.render("./inventory/inventory", {
        title: vehicleName,
        nav,
        buildArea,
    })
}

/* **************************
 * Deliver management view
 * **************************/
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let newClass = await utilities.buildNewClassView()
    let addCar = await utilities.buildNewCarView()
    req.flash("notice", "")
    res.render("./inventory/", {
        title: "Management - Inventory Control",
        nav,
        newClass,
        addCar,
        errors: null,
    })
}

/* **************************
 * Deliver classification management view
 * **************************/
invCont.buildClassManageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "")
    res.render("./inventory/add-classification", {
        title: "New Classification",
        nav,
        errors: null,
    })
}

/* **************************
 * Deliver inventory management view
 * **************************/
invCont.buildInvManageView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let carClass = await utilities.getFormSelections()
    req.flash("notice", "")
    res.render("./inventory/add-inventory", {
        title: "New Inventory",
        nav,
        carClass,
        errors: null,
    })
}

/* ****************************
 * Create new vehicle classification 
 * ****************************/
invCont.createNewClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classification_name = req.body

    const regResult = await inventory-model.createNewClassification(
        classification_name
    )

    if (regResult) {
        req.flash(
            "notice",
            `${name} has been added.`
        )
        res.status(201).render("/", {
            title: "Management - New Inventory",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, classifiction not added. Please try again.")
        res.status(501).render("/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
}

module.exports = invCont