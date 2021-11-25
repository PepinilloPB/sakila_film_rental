"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
//Prueba para ver que servidor funciona
class IndexController {
    index(req, res) {
        res.send("Index correcto");
    }
}
exports.indexController = new IndexController();
