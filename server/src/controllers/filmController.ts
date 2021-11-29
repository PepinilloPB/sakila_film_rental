import { Response, Request } from "express";

//Pool para queries
import pool from '../database';

class FilmController{
    
    //Listado de peliculas de pagina de inicio
    public async list (req: Request, res: Response) { 

        //Parametro para ver cual tienda es de la venta
        const { store_id } = req.params;
        
        //Pide las 10 primeras peliculas por fecha de estreno (last_update)
        const films_premiere = await pool.query('SELECT f.film_id, ' + 
                                                    '    f.title, ' +
                                                    '    f.description, ' + 
                                                    '    f.release_year, ' + 
                                                    '    l.name as language, ' + 
                                                    '    ol.name as original_language, ' +
                                                    '    f.rental_duration, ' + 
                                                    '    f.rental_rate, ' + 
                                                    '    f.length, ' + 
                                                    '    f.replacement_cost, ' + 
                                                    '    f.rating, ' + 
                                                    '    f.special_features, ' + 
                                                    '    f.last_update, ' +
                                                    '    i.inventory_id ' +
                                                ' FROM film f ' + 
                                                '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                                '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                                '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' +
                                                '   WHERE i.store_id = ? ' + 
                                                '   GROUP BY i.film_id ' +
                                                '   ORDER BY i.last_update ' + 
                                                ' LIMIT 9 ', [store_id]);

        //Pide las peliculas mas rentadas por la semana
        const films_week = await pool.query('SELECT f.film_id, ' + 
                                                '    f.title, ' +
                                                '    f.description, ' + 
                                                '    f.release_year, ' + 
                                                '    l.name as language, ' + 
                                                '    ol.name as original_language, ' +
                                                '    f.rental_duration, ' + 
                                                '    f.rental_rate, ' + 
                                                '    f.length, ' + 
                                                '    f.replacement_cost, ' + 
                                                '    f.rating, ' + 
                                                '    f.special_features, ' + 
                                                '    f.last_update, ' +
                                                '    i.inventory_id ' +
                                            ' FROM film f ' + 
                                            '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                            '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                            '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' +
                                            '   LEFT JOIN rental r ON (i.inventory_id = r.inventory_id) ' + 
                                            '   WHERE i.store_id = ? ' + 
                                            '   GROUP BY i.film_id ' +
                                            '   ORDER BY WEEK(r.rental_date) DESC, COUNT(i.film_id) DESC ' + //Revisar que sea WEEK
                                            '   LIMIT 9', [store_id]);

        //Pide las peliculas mas rentadas anualmente
        const films_year = await pool.query('SELECT f.film_id, ' + 
                                               '    f.title, ' +
                                               '    f.description, ' + 
                                               '    f.release_year, ' + 
                                               '    l.name as language, ' + 
                                               '    ol.name as original_language, ' +
                                               '    f.rental_duration, ' + 
                                               '    f.rental_rate, ' + 
                                               '    f.length, ' + 
                                               '    f.replacement_cost, ' + 
                                               '    f.rating, ' + 
                                               '    f.special_features, ' + 
                                               '    f.last_update, ' +
                                               '    i.inventory_id ' +
                                            ' FROM film f ' + 
                                            '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                            '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                            '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' +
                                            '   LEFT JOIN rental r ON (i.inventory_id = r.inventory_id) ' +
                                            '   WHERE i.store_id = ? ' + 
                                            '   GROUP BY i.film_id ' +
                                            '   ORDER BY YEAR(r.rental_date) DESC, COUNT(i.film_id) DESC ' + //Revisar que sea YEAR
                                            '   LIMIT 9', [store_id]);

        //Guardamos los resultados de todas las peticiones en una matriz
        //IMPORTANTE ORDEN DE MATRIZ: ESTRENOS, SEMANAL, ANUAL 
        const films = [films_premiere, films_week, films_year];

        //Mostramos los resultados
        res.json(films);
    }

    //Buscar pelicula por titulo
    public async find_by_title(req: Request, res: Response): Promise<any>{

        //Agarramos parametro de la url
        const { title } = req.params;

        //Pide peliculas que coincidan con el titulo
        const films = await pool.query('SELECT f.film_id, ' + 
                                        '    f.title, ' +
                                        '    f.description, ' + 
                                        '    f.release_year, ' + 
                                        '    l.name as language, ' + 
                                        '    ol.name as original_language, ' +
                                        '    f.rental_duration, ' + 
                                        '    f.rental_rate, ' + 
                                        '    f.length, ' + 
                                        '    f.replacement_cost, ' + 
                                        '    f.rating, ' + 
                                        '    f.special_features, ' + 
                                        '    f.last_update, ' +
                                        '    i.inventory_id ' +
                                    ' FROM film f ' + 
                                    '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                    '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                    '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' + 
                                    ' WHERE ' + 
                                    '   INSTR(f.title, ?) > 0', [title]);

        //Mostramos los resultados
        res.json(films);
    }

    //Buscar pelicula por nombre del actor
    public async find_by_actor(req: Request, res: Response): Promise<any>{

        //Agarramos parametro de la url
        //IMPORTANTE FORMATO DE PARAMETRO: SI HAY UN ESPACIO EN EL PARAMERTRO, QUE NO 
        //ESTE AL INICIO O AL FINAL, SE TOMA COMO NOMBRE Y APELLIDO, SINO SOLO NOMBRE O APELLIDO
        const { name } = req.params;

        //Vemos si existe un espacio en los parametros, que no este al inicio o al final
        if(name.indexOf(' ') > -1 && name.indexOf(' ') != name.length - 1 && name.indexOf(' ') != 0){

            //Partimos el parametro para conseguir el nombre y apellido
            const fname = name.substring(0, name.indexOf(' '));
            const lname = name.substring(name.indexOf(' ') + 1);

            //Pide peliculas que coincidan con el nombre Y apellido
            const films = await pool.query('SELECT f.film_id, ' + 
                                            '    f.title, ' +
                                            '    f.description, ' + 
                                            '    f.release_year, ' + 
                                            '    l.name as language, ' + 
                                            '    ol.name as original_language, ' +
                                            '    f.rental_duration, ' + 
                                            '    f.rental_rate, ' + 
                                            '    f.length, ' + 
                                            '    f.replacement_cost, ' + 
                                            '    f.rating, ' + 
                                            '    f.special_features, ' + 
                                            '    f.last_update, ' +
                                            '    i.inventory_id ' +
                                        ' FROM film f ' + 
                                        '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                        '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                        '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' + 
                                        '   LEFT JOIN film_actor fa ON (f.film_id = fa.film_id) ' +
                                        '   LEFT JOIN actor a ON (fa.actor_id = a.actor_id) ' + 
                                        ' WHERE UPPER(a.first_name) = ? ' + 
                                        ' AND UPPER(a.last_name) = ? ',// Aqui debe decir AND
                                        [fname, lname]);

            //Mostramos los resultados
            res.json(films);
        //Si no tiene espacios, suponemos que es un nombre o apellido
        }else{
            //Pide peliculas que coincidan con el nombre Y apellido
            const films = await pool.query('SELECT f.film_id, ' + 
                                            '    f.title, ' +
                                            '    f.description, ' + 
                                            '    f.release_year, ' + 
                                            '    l.name as language, ' + 
                                            '    ol.name as original_language, ' +
                                            '    f.rental_duration, ' + 
                                            '    f.rental_rate, ' + 
                                            '    f.length, ' + 
                                            '    f.replacement_cost, ' + 
                                            '    f.rating, ' + 
                                            '    f.special_features, ' + 
                                            '    f.last_update, ' +
                                            '    i.inventory_id ' +
                                        ' FROM film f ' + 
                                        '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                        '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                        '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' + 
                                        '   LEFT JOIN film_actor fa ON (f.film_id = fa.film_id) ' +
                                        '   LEFT JOIN actor a ON (fa.actor_id = a.actor_id) ' + 
                                        ' WHERE UPPER(a.first_name) = ? ' + 
                                        ' OR UPPER(a.last_name) = ? ',// Aqui debe decir OR
                                        [name, name]);

            //Mostramos los resultados
            res.json(films);
        }
    }

    //Buscar por id, solo usado para añadir peliculas al carrito
    public async find_by_id(req: Request, res: Response): Promise<any>{

        //Parametro pasado por url
        const { film_id } = req.params;

        //Pedido peliculas que coincidan con el film_id
        const films = await pool.query('SELECT f.film_id, ' + 
                                        '    f.title, ' +
                                        '    f.description, ' + 
                                        '    f.release_year, ' + 
                                        '    l.name as language, ' + 
                                        '    ol.name as original_language, ' +
                                        '    f.rental_duration, ' + 
                                        '    f.rental_rate, ' + 
                                        '    f.length, ' + 
                                        '    f.replacement_cost, ' + 
                                        '    f.rating, ' + 
                                        '    f.special_features, ' + 
                                        '    f.last_update, ' +
                                        '    i.inventory_id ' +
                                    ' FROM film f ' + 
                                    '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                    '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                    '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' + 
                                    ' WHERE ' + 
                                    '   f.film_id = ?', [film_id]);

        //Mostramos los resultados
        res.json(films[0]);
    }

    //Tentativo: 3 metodos para cada resultado de query

    /*public async list_premiere (req: Request, res: Response){

        //Pide las 10 primeras peliculas por fecha de estreno (last_update)
        const films = await pool.query('SELECT * FROM film ORDER BY last_update LIMIT 10');

        //Mostramos los resultados
         res.json(films);
    }

    public async list_week (req: Request, res: Response){

        //Pide las peliculas mas rentadas por la semana
        const films = await pool.query('SELECT f.film_id, ' + 
                                                '    f.title, ' +
                                                '    f.description, ' + 
                                                '    f.release_year, ' + 
                                                '    l.name as language, ' + 
                                                '    ol.name as original_language, ' +
                                                '    f.rental_duration, ' + 
                                                '    f.rental_rate, ' + 
                                                '    f.length, ' + 
                                                '    f.replacement_cost, ' + 
                                                '    f.rating, ' + 
                                                '    f.special_features, ' + 
                                                '    f.last_update ' +
                                            ' FROM film f ' + 
                                            '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                            '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                            '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' +
                                            '   LEFT JOIN rental r ON (i.inventory_id = r.inventory_id) ' + 
                                            '   GROUP BY i.film_id ' +
                                            '   ORDER BY WEEK(r.rental_date) DESC, COUNT(i.film_id) DESC ' +
                                            '   LIMIT 10');

        //Mostramos los resultados
        res.json(films);
    }

    public async list_year (req: Request, res: Response){

        //Pide las peliculas mas rentadas anualmente
        const films = await pool.query('SELECT f.film_id, ' + 
                                               '    f.title, ' +
                                               '    f.description, ' + 
                                               '    f.release_year, ' + 
                                               '    l.name as language, ' + 
                                               '    ol.name as original_language, ' +
                                               '    f.rental_duration, ' + 
                                               '    f.rental_rate, ' + 
                                               '    f.length, ' + 
                                               '    f.replacement_cost, ' + 
                                               '    f.rating, ' + 
                                               '    f.special_features, ' + 
                                               '    f.last_update ' +
                                            ' FROM film f ' + 
                                            '   LEFT JOIN language l ON ( f.language_id = l.language_id) ' +
                                            '   LEFT JOIN language ol ON ( f.original_language_id = ol.language_id) ' +
                                            '   LEFT JOIN inventory i ON (f.film_id = i.film_id) ' +
                                            '   LEFT JOIN rental r ON (i.inventory_id = r.inventory_id) ' + 
                                            '   GROUP BY i.film_id ' +
                                            '   ORDER BY YEAR(r.rental_date) DESC, COUNT(i.film_id) DESC ' + 
                                            '   LIMIT 10');

        //Mostramos los resultados
        res.json(films);
    }*/
}

export const filmController = new FilmController();