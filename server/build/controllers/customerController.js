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
exports.customerController = void 0;
//Pool para queries
const database_1 = __importDefault(require("../database"));
class CustomerController {
    //Estos metodos NO usan openid connect
    //Obtener un cliente por su email
    list_customer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Parametro que tiene el email
            const { email } = req.params;
            //Peticion de busqueda por email
            const customers = yield database_1.default.query(' SELECT * ' +
                ' FROM customer ' +
                ' WHERE email = ? ', [email]);
            //Mostramos resultado
            res.send(customers[0]);
        });
    }
    //Actualizar al cliente
    update_customer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Id del cliente para actualizarlo
            const { customer_id } = req.params;
            //Actualiza al cliente
            yield database_1.default.query('UPDATE customer SET ? WHERE customer_id = ?', [req.body, customer_id]);
            //Mensaje de aprobacion
            res.json({ message: 'customer updated' });
        });
    }
    //Obtener la direccion de un cliente 
    get_address(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Id del cliente para buscar su direccion
            const { customer_id } = req.params;
            //Pedimos la direccion
            const address = yield database_1.default.query(' SELECT a.address_id, ' +
                '        a.address, ' +
                '        a.address2, ' +
                '        a.district, ' +
                '        c.city, ' +
                '        co.country, ' +
                '        a.postal_code, ' +
                '        a.phone ' +
                ' FROM address a ' +
                '  LEFT JOIN city c ON ( a.city_id = c.city_id) ' +
                '  LEFT JOIN country co ON ( c.country_id = co.country_id) ' +
                '  LEFT JOIN customer cu ON ( a.address_id = cu.address_id) ' +
                ' WHERE cu.customer_id = ?', [customer_id]);
            //Mostramos resultado
            res.send(address[0]);
        });
    }
    //Crear nueva direccion
    create_address(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO address SET ?', [req.body]);
            res.json({ message: 'address saved' });
        });
    }
    //Actualizar la direccion
    update_address(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Id de la direccion para actualizarla
            const { address_id } = req.params;
            //Actualizamos la direccion
            yield database_1.default.query('UPDATE address SET ? WHERE address_id = ?', [req.body, address_id]);
            //Mensaje de aprobacion
            res.json({ message: 'address updated' });
        });
    }
}
exports.customerController = new CustomerController();
