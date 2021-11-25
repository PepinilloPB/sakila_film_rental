"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
//Guardamos temporalmente los articulos en este array
const films = [];
class CartController {
    //Metodo para listar los articulos del carrito
    list_cart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(films);
        });
    }
    //Metodo para guardar articulos en el carrito
    save_in_cart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Agregamos al final de array
            films.push(req.body);
            res.json({ message: 'Guarda en carrito' });
        });
    }
    //Metodo para remover del carrito
    remove_from_cart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Variable para buscar si el articulo esta en el array
            //Pasamos el parametro del id de la pelicula para la busqueda
            var index = films.findIndex(film => film.film_id == req.params.id);
            //Si index es mayor a -1, lo encontro
            if (index > -1) {
                //Splice remueve desde el valor index y borra 1 o más valor 
                films.splice(index, 1);
                res.json({ message: 'Quitado del carrito' });
            }
            else {
                res.sendStatus(404);
            }
        });
    }
}
exports.cartController = new CartController();
