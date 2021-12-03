"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Prueba hecha para auth0
class IndexRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', (req, res) => {
            res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
        });
    }
}
const indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
