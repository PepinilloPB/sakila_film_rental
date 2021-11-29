import { Response, Request } from "express";

//Request que permite usar oidc para sacar info de user
import { OpenidRequest, OpenidResponse } from 'express-openid-connect';

//Pool para queries
import pool from '../database';

class CustomerController{

    //Estos metodos NO usan openid connect

    //Obtener un cliente por su email
    public async list_customer(req: OpenidRequest, res: OpenidResponse): Promise<any>{

        //Parametro que tiene el email
        const { email } = req.params;

        //Peticion de busqueda por email
        const customers = await pool.query(' SELECT * ' + 
                                            ' FROM customer ' + 
                                            ' WHERE email = ? ', [email]);

        //Mostramos resultado
        res.send(customers[0]);
    }

    //Actualizar al cliente
    public async update_customer(req: Request, res: Response): Promise<void>{

        //Id del cliente para actualizarlo
        const { customer_id } = req.params;

        //Actualiza al cliente
        await pool.query('UPDATE customer SET ? WHERE customer_id = ?', [req.body, customer_id]);

        //Mensaje de aprobacion
        res.json({message: 'customer updated'});
    }

    //Obtener la direccion de un cliente 
    public async get_address(req: Request, res: Response): Promise<any>{

        //Id del cliente para buscar su direccion
        const { customer_id } = req.params;

        //Pedimos la direccion
        const address = await pool.query(' SELECT a.address_id, ' +
                                         '        a.address, ' + 
                                         '        a.address2, ' + 
                                         '        a.district, ' + 
                                         '        c.city, ' + 
                                         '        co.country, ' +
                                         '        a.postal_code, ' +
                                         '        a.phone ' + 
                                         ' FROM address a '+ 
                                         '  LEFT JOIN city c ON ( a.city_id = c.city_id) ' +
                                         '  LEFT JOIN country co ON ( c.country_id = co.country_id) ' +
                                         '  LEFT JOIN customer cu ON ( a.address_id = cu.address_id) ' + 
                                         ' WHERE cu.customer_id = ?', [customer_id]);
        
        //Mostramos resultado
        res.send(address[0]);
    }

    //Crear nueva direccion
    public async create_address(req: Request, res: Response): Promise<void>{
        await pool.query('INSERT INTO address SET ?', [req.body]);
        res.json({message: 'address saved'});
    }

    //Actualizar la direccion
    public async update_address(req: Request, res: Response): Promise<void>{
        
        //Id de la direccion para actualizarla
        const { address_id } = req.params;

        //Actualizamos la direccion
        await pool.query('UPDATE address SET ? WHERE address_id = ?', [req.body, address_id]);

        //Mensaje de aprobacion
        res.json({message: 'address updated'});
    }

    //Estos metodos SI usan openid connect
    /*
    //Obtener un cliente por su email
    //OpenidRequest y OpenidResponse funcionan igual que Request y Response
    public async list_customer(req: OpenidRequest, res: OpenidResponse): Promise<any>{
        const { store_id } = req.params;

        //Verificamos que el usuario exista
        if (req.oidc.user){

            //Pide clientes que coincidan con el email
            const customers = await pool.query(' SELECT * ' + 
                                               ' FROM customer ' + 
                                               ' WHERE email = ? ', [req.oidc.user.email]);

            //Si el email coincide con algun usuario, el array customers no estará
            //vacío 
            if(customers.length > 0){
                //Enviamos los resultados
                res.send(customers);

            //Si el array customers esta vacío, significa que pasó el login pero no es un cliente
            //en la base de datos, por lo creamos 
            }else{

                //Creamos un nuevo cliente, con algunos valores vacios o por defecto
                const new_customer = 
                {
                    store_id: store_id, // ID de store pasado por url
                    first_name: req.oidc.user.name, //Parametro name de user
                    last_name: '', //Apellido vacío
                    email: req.oidc.user.email, //Parametro email de user, este debe de ser correcto
                    address_id: 1, //Dirección 1 no es usada por nadie, significa que no hay direccion
                    active: 1 //Activo es 1 por defecto
                }
                
                //Query para insertar al nuevo cliente en la DB
                await pool.query('INSERT INTO customer SET ?', [new_customer]);

                //Repetimos el query para pedir cliente
                const customers = await pool.query(' SELECT * ' + 
                                                   ' FROM customer ' + 
                                                   ' WHERE email = ? ', [req.oidc.user.email]);
                //Mostramos resultado
                res.send(customers);
            }
        }else{
            res.status(404).send('Usuario no encontrado');
        }
    }

    //Actualizar al cliente
    public async update_customer(req: OpenidRequest, res: OpenidResponse): Promise<void>{

        //Id del cliente para actualizarlo
        const { customer_id } = req.params;

        //Actualiza al cliente
        await pool.query('UPDATE customer SET ? WHERE customer_id = ?', [req.body, customer_id]);

        //Mensaje de aprobacion
        res.json({message: 'customer updated'});
    }

    //Obtener la direccion de un cliente 
    public async get_address(req: OpenidRequest, res: OpenidResponse): Promise<any>{

        //Id del cliente para buscar su direccion
        const { customer_id } = req.params;

        //Pedimos la direccion
        const address = await pool.query(' SELECT a.address_id, ' +
                                         '        a.address, ' + 
                                         '        a.address2, ' + 
                                         '        a.district, ' + 
                                         '        c.city, ' + 
                                         '        co.country, ' +
                                         '        a.postal_code, ' +
                                         '        a.phone ' + 
                                         ' FROM address a '+ 
                                         '  LEFT JOIN city c ON ( a.city_id = c.city_id) ' +
                                         '  LEFT JOIN country co ON ( c.country_id = co.country_id) ' +
                                         '  LEFT JOIN customer cu ON ( a.address_id = cu.address_id) ' + 
                                         ' WHERE cu.customer_id = ?', [customer_id]);
        
        //Mostramos resultado
        res.send(address);
    }

    //Actualizar la direccion
    public async update_address(req: OpenidRequest, res: OpenidResponse): Promise<void>{
        
        //Id de la direccion para actualizarla
        const { address_id } = req.params;

        //Actualizamos la direccion
        await pool.query('UPDATE address SET ? WHERE address_id = ?', [req.body, address_id]);

        //Mensaje de aprobacion
        res.json({message: 'address updated'});
    }
    */
}

export const customerController = new CustomerController();