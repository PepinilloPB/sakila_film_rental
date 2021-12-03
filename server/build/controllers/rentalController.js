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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rentalController = void 0;
//Pool para queries
const database_1 = __importDefault(require("../database"));
class RentalController {
    //Metodo para crear añadir renta de pelicula a tabla rental
    create_rental(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Query para ingreso de datos a tabla renta
            //IMPORTANTE: Puede haber problemas si en rental existen filas sin  
            //fecha de devolucion
            yield database_1.default.query('INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id) VALUES ' +
                ' (current_date(), ? , ? , NULL, ? ) ', [req.body.inventory_id, req.body.customer_id, req.body.staff_id]);
            //Mensaje 
            res.json({ message: 'rental saved' });
        });
    }
}
exports.rentalController = new RentalController();
