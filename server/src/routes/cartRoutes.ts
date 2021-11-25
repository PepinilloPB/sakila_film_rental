import { Router } from "express";

import { cartController } from "../controllers/cartController";

class CartRoutes{

    //Router tiene metodos http
    public router: Router = Router();

    constructor(){
        this.config();
    }

    config(): void{

        //Ruta para listar los elementos del carrito
        this.router.get('/', cartController.list_cart);

        //Ruta para agregar elemento a carrito
        this.router.post('/', cartController.save_in_cart);

        //Ruta para borrar elemento de carrito
        this.router.delete('/:id', cartController.remove_from_cart);
    }
}

const cartRoutes = new CartRoutes();
export default cartRoutes.router;