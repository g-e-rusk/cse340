const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* **************************************************
 * Constructs the nav HTML unordered list
 * ************************************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' + 
            row.classification_id +
            '" title="See our inventory of ' + 
            row.classification_name + 
            ' vehicles">' +
            row.classification_name + 
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **********************************
 * Build the classification view HTML
 * ********************************** */
Util.buildClassificationGrid = async function(data) {
    let grid
    if(data && data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li class="grid-display">'
            grid += '<a href="../../inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
            + ' details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors"></a>'
            grid += '<div class="namePrice">'
            grid += '<hr>'
            grid += '<h2 class="vehicleTitle">'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View'
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span class="priceField">$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matcing vehicles could be found.</p>'
    }
    return grid
}

/* **********************************
 * Build the single vehicle inventory view HTML
 * ********************************** */
Util.buildVehicleInfo = async function(data) {
    let grid
    if(data.length > 0) {
        grid = '<div id="vehicle-info">'
        data.forEach(vehicle => {
            grid += '<img src="' + vehicle.inv_image
            +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors">'
            grid += '<div class="vehicle-display">'
            grid += '<span class="price"><strong>Price:</strong> $ '
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '<hr class="vehicleInfo">'
            grid += '<p class="description"><strong>Description:</strong> ' + vehicle.inv_description
            grid += '</p>'
            grid += '<span class="vehicleColor"><strong>Color:</strong> ' + vehicle.inv_color 
            grid += '</span>'
            grid += '<br>'
            grid += '<span class="vehicleMiles"><strong>Mileage:</strong> '
            + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>'
            grid += '</div>'
            
        })
        grid += '</div>'
    } else {
        grid += '<p class="notice">Sorry, no matcing vehicles could be found.</p>'
    }
    return grid
}

/* **************************************************
 * Constructs the management view add inventory drop-down menu
 * ************************************************** */
Util.getFormSelections = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = '<label for="carClass" class="newInvClass">Choose the vehicle classification: </label>'
    list += '<select id="classification_id" name="classification_id" class="newInvClass">'
    list+= '<option class="newInvClass" value="Select one"></option>'
    data.rows.forEach((row) => {
        list +=
            `<option class="newInvClass" value="${row.classification_id}">${row.classification_name}</option>`})
    return list
}

/* **********************************************
 * Constructs the links for the new classification page
 * **********************************************/
Util.buildNewClassView = async function (req, res, next) {
    let newCarClass = '<a href="/inv/add-classification">Add New Classification</a>'
    return newCarClass
}

/* **********************************************
 * Constructs the links for the new inventory page
 * **********************************************/
Util.buildNewCarView = async function (req, res, next) {
    let newCar = '<a href="/inv/add-inventory">Add New Inventory</a>'
    return newCar
}


/* **********************************
 * Middleware for Handling Errors
 * Wrap another function in this for
 * General Error Handling
 * ********************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
 * Middleware for Checking for existence of cookie for JWT
 * **************************************/
Util.checkJWTToken = (req, res, next) => {
    if(req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("notice", "Please log in")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
            res.locals.accountData = accountData
            res.locals.loggedin = 1
            next()
            })
    } else {
        next()
    }
}

/* ****************************
 * Check Login
 * ****************************/
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

module.exports = Util