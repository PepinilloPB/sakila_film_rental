"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rentalController_1 = require("../controllers/rentalController");
class RentalRoutes {
    constructor() {
        //Router tiene metodos http
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Metodo para guardar renta en DB
        this.router.post("/", rentalController_1.rentalController.create_rental);
    }
}
const rentalRoutes = new RentalRoutes();
exports.default = rentalRoutes.router;
