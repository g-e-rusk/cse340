// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by single vehicle view
router.get("/detail/:inventoryId", invController.buildByVehicleId)

// Route to generate an intentional error process
router.get("/error", errorController.generateError)

module.exports = router