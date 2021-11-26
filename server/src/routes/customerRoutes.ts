import { Router } from "express";

import { customerController } from "../controllers/customerController";

class CustomerRoutes{
    //Router tiene metodos http
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{

        //Ruta para listar UN SOLO CLIENTE, dependiendo del login de auth0
        //this.router.get("/:store_id", customerController.list_customer); 

        //Ruta para listar UN SOLO CLIENTE
        this.router.get("/:email", customerController.list_customer); 

        //Ruta para actualizar la información del cliente
        this.router.put("/:customer_id", customerController.update_customer);

        //Ruta para listar la direccion del cliente
        this.router.get("/address/:customer_id", customerController.get_address); 

        //Ruta para crear la direccion del cliente
        this.router.post("/address", customerController.get_address); 

        //Ruta para actualizar la direccion del cliente
        this.router.put("/address/:address_id", customerController.update_address);

    }
}

const customerRoutes = new CustomerRoutes();
export default customerRoutes.router;