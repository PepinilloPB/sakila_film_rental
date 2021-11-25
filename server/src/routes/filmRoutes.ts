import { Router } from "express";

import { filmController } from "../controllers/filmController";

class FilmRoutes{

    //Router tiene metodos http
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{
        
        //Ruta para listado de estrenos, mas vistos semanalmente y anualmente
        this.router.get("/:store_id", filmController.list); 

        //Ruta para buscar por titulo de pelicula
        this.router.get("/title/:title", filmController.find_by_title); 

        //Ruta para buscar por nombre de actor
        this.router.get("/actor/:name", filmController.find_by_actor); 
        
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
export default filmRoutes.router;