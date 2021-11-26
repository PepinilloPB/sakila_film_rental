"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
class CustomerRoutes {
    constructor() {
        //Router tiene metodos http
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Ruta para listar UN SOLO CLIENTE, dependiendo del login de auth0
        //this.router.get("/:store_id", customerController.list_customer); 
        //Ruta para listar UN SOLO CLIENTE
        this.router.get("/:email", customerController_1.customerController.list_customer);
        //Ruta para actualizar la información del cliente
        this.router.put("/:customer_id", customerController_1.customerController.update_customer);
        //Ruta para listar la direccion del cliente
        this.router.get("/address/:customer_id", customerController_1.customerController.get_address);
        //Ruta para crear la direccion del cliente
        this.router.post("/address", customerController_1.customerController.get_address);
        //Ruta para actualizar la direccion del cliente
        this.router.put("/address/:address_id", customerController_1.customerController.update_address);
    }
}
const customerRoutes = new CustomerRoutes();
exports.default = customerRoutes.router;
