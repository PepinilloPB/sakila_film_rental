"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
class CartRoutes {
    constructor() {
        //Router tiene metodos http
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Ruta para listar los elementos del carrito
        this.router.get('/', cartController_1.cartController.list_cart);
        //Ruta para agregar elemento a carrito
        this.router.post('/', cartController_1.cartController.save_in_cart);
        //Ruta para borrar elemento de carrito
        this.router.delete('/:id', cartController_1.cartController.remove_from_cart);
    }
}
const cartRoutes = new CartRoutes();
exports.default = cartRoutes.router;
