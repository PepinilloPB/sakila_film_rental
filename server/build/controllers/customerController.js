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
    //Obtener un cliente por su email
    //OpenidRequest y OpenidResponse funcionan igual que Request y Response
    list_customer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { store_id } = req.params;
            //Verificamos que el usuario exista
            if (req.oidc.user) {
                //Pide clientes que coincidan con el email
                const customers = yield database_1.default.query(' SELECT * ' +
                    ' FROM customer ' +
                    ' WHERE email = ? ', [req.oidc.user.email]);
                //Si el email coincide con algun usuario, el array customers no estará
                //vacío 
                if (customers.length > 0) {
                    //Enviamos los resultados
                    res.send(customers);
                    //Si el array customers esta vacío, significa que pasó el login pero no es un cliente
                    //en la base de datos, por lo creamos 
                }
                else {
                    //Creamos un nuevo cliente, con algunos valores vacios o por defecto
                    const new_customer = {
                        store_id: store_id,
                        first_name: req.oidc.user.name,
                        last_name: '',
                        email: req.oidc.user.email,
                        address_id: 1,
                        active: 1 //Activo es 1 por defecto
                    };
                    //Query para insertar al nuevo cliente en la DB
                    yield database_1.default.query('INSERT INTO customer SET ?', [new_customer]);
                    //Repetimos el query para pedir cliente
                    const customers = yield database_1.default.query(' SELECT * ' +
                        ' FROM customer ' +
                        ' WHERE email = ? ', [req.oidc.user.email]);
                    //Mostramos resultado
                    res.send(customers);
                }
            }
            else {
                res.status(404).send('Usuario no encontrado');
            }
        });
    }
    //
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
            res.send(address);
        });
    }
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
