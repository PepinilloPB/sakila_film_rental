import { Response, Request } from "express";

//Guardamos temporalmente los articulos en este array
const films : any[] = [];

class CartController{
    
    //Metodo para listar los articulos del carrito
    public async list_cart (req: Request, res: Response): Promise<void>{
        res.json(films);
    }

    //Metodo para guardar articulos en el carrito
    public async save_in_cart (req: Request, res: Response): Promise<void>{
        //Agregamos al final de array
        films.push(req.body);
        res.json({message: 'Guarda en carrito'});
    }

    //Metodo para remover del carrito
    public async remove_from_cart (req: Request, res: Response): Promise<void>{
        //Variable para buscar si el articulo esta en el array
        //Pasamos el parametro del id de la pelicula para la busqueda
        var index = films.findIndex(film => film.film_id == req.params.id);

        //Si index es mayor a -1, lo encontro
        if(index > -1){
            //Splice remueve desde el valor index y borra 1 o más valor 
            films.splice(index, 1);
            res.json({message: 'Quitado del carrito'});
        } else {
            res.sendStatus(404);
        }
    }
}

export const cartController = new CartController();