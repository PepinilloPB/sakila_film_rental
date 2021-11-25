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
exports.filmController = void 0;
//Pool para queries
const database_1 = __importDefault(require("../database"));
class FilmController {
    //Listado de peliculas de pagina de inicio
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Parametro para ver cual tienda es de la venta
            const { store_id } = req.params;
            //Pide las 10 primeras peliculas por fecha de estreno (last_update)
            const films_premiere = yield database_1.default.query('SELECT f.film_id, ' +
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
                '   WHERE i.store_id = ? ' +
                '   GROUP BY i.film_id ' +
                '   ORDER BY last_update ' +
                ' LIMIT 10 ', [store_id]);
            //Pide las peliculas mas rentadas por la semana
            const films_week = yield database_1.default.query('SELECT f.film_id, ' +
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
                '   WHERE i.store_id = ? ' +
                '   GROUP BY i.film_id ' +
                '   ORDER BY WEEK(r.rental_date) DESC, COUNT(i.film_id) DESC ' + //Revisar que sea WEEK
                '   LIMIT 10', [store_id]);
            //Pide las peliculas mas rentadas anualmente
            const films_year = yield database_1.default.query('SELECT f.film_id, ' +
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
                '   ORDER BY YEAR(r.rental_date) DESC, COUNT(i.film_id) DESC ' + //Revisar que sea YEAR
                '   LIMIT 10');
            //Guardamos los resultados de todas las peticiones en una matriz
            //IMPORTANTE ORDEN DE MATRIZ: ESTRENOS, SEMANAL, ANUAL 
            const films = [films_premiere, films_week, films_year];
            //Mostramos los resultados
            res.json(films);
        });
    }
    //Buscar pelicula por titulo
    find_by_title(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Agarramos parametro de la url
            const { title } = req.params;
            //Pide peliculas que coincidan con el titulo
            const films = yield database_1.default.query('SELECT f.film_id, ' +
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
                ' WHERE ' +
                '   INSTR(f.title, ?) > 0', [title]);
            //Mostramos los resultados
            res.json(films);
        });
    }
    //Buscar pelicula por nombre del actor
    find_by_actor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //Agarramos parametro de la url
            //IMPORTANTE FORMATO DE PARAMETRO: SI HAY UN ESPACIO EN EL PARAMERTRO, QUE NO 
            //ESTE AL INICIO O AL FINAL, SE TOMA COMO NOMBRE Y APELLIDO, SINO SOLO NOMBRE O APELLIDO
            const { name } = req.params;
            //Vemos si existe un espacio en los parametros, que no este al inicio o al final
            if (name.indexOf(' ') > -1 && name.indexOf(' ') != name.length - 1 && name.indexOf(' ') != 0) {
                //Partimos el parametro para conseguir el nombre y apellido
                const fname = name.substring(0, name.indexOf(' '));
                const lname = name.substring(name.indexOf(' ') + 1);
                //Pide peliculas que coincidan con el nombre Y apellido
                const films = yield database_1.default.query('SELECT f.film_id, ' +
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
                    '   LEFT JOIN film_actor fa ON (f.film_id = fa.film_id) ' +
                    '   LEFT JOIN actor a ON (fa.actor_id = a.actor_id) ' +
                    ' WHERE UPPER(a.first_name) = ? ' +
                    ' AND UPPER(a.last_name) = ? ', // Aqui debe decir AND
                [fname, lname]);
                //Mostramos los resultados
                res.json(films);
                //Si no tiene espacios, suponemos que es un nombre o apellido
            }
            else {
                //Pide peliculas que coincidan con el nombre Y apellido
                const films = yield database_1.default.query('SELECT f.film_id, ' +
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
                    '   LEFT JOIN film_actor fa ON (f.film_id = fa.film_id) ' +
                    '   LEFT JOIN actor a ON (fa.actor_id = a.actor_id) ' +
                    ' WHERE UPPER(a.first_name) = ? ' +
                    ' OR UPPER(a.last_name) = ? ', // Aqui debe decir OR
                [name, name]);
                //Mostramos los resultados
                res.json(films);
            }
        });
    }
}
exports.filmController = new FilmController();
