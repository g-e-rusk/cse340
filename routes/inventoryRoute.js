// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by single vehicle view
router.get("/detail/:inventoryId", invController.buildByVehicleId)

// Route to generate an intentional error process
router.get("/error", errorController.generateError)

// Route to get to management view
router.get("/", invController.buildManagementView)

// Route to get to classification management view
router.get("/add-classification", invController.buildClassManageView)

// Route to get to inventory management view
router.get("/add-inventory", invController.buildInvManageView)

// Route to add new vehicle classification
router.post("./add-classification", invController.createNewClassification)

module.exports = router