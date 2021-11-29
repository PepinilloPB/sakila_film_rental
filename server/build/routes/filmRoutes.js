"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const filmController_1 = require("../controllers/filmController");
class FilmRoutes {
    constructor() {
        //Router tiene metodos http
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //Ruta para listado de estrenos, mas vistos semanalmente y anualmente
        this.router.get("/:store_id", filmController_1.filmController.list);
        //Ruta para buscar por titulo de pelicula
        this.router.get("/title/:title", filmController_1.filmController.find_by_title);
        //Ruta para buscar por nombre de actor
        this.router.get("/actor/:name", filmController_1.filmController.find_by_actor);
        //Ruta para buscar por id de pelicua
        this.router.get("/id/:film_id", filmController_1.filmController.find_by_id);
        /*
        //Ruta para listado de estrenos
        this.router.get("/movies/premiere", filmController.list_premiere);

        //Ruta para listado de mas vistos semanalmnete
        this.router.get("/movies/week", filmController.list_week);

        //Ruta para listado de mas vistos anualmente
        this.router.get("/movies/year", filmController.list_year);
        */
    }
}
const filmRoutes = new FilmRoutes();
exports.default = filmRoutes.router;
