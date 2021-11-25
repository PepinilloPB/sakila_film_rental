import { Response, Request } from "express";

//Prueba para ver que servidor funciona
class IndexController{
    public index (req: Request, res: Response){
        res.send("Index correcto");
    }
}

export const indexController = new IndexController();