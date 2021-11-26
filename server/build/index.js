"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const filmRoutes_1 = __importDefault(require("./routes/filmRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
//import { OpenidRequest } from 'express-openid-connect';
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
//Variables de entorno (necesario si usamos auth0)
//require('dotenv').config();
//Metodos de openid connect
//const { auth, requiresAuth } = require('express-openid-connect');
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config(); //Seteo de puerto, morgan, cors y express
        this.routes(); //Seteo de rutas 
    }
    config() {
        this.app.set('port', process.env.PORT || 3000); // Servidor en puerto 3000
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        //Conexion con auth0
        /*this.app.use(
            auth({
                authRequired: false,
                auth0Logout: true,
                issuerBaseURL: process.env.ISSUER_BASE_URL,
                baseURL: process.env.BASE_URL,
                clientID: process.env.CLIENT_ID,
                secret: process.env.SECRET
            })
        );*/
    }
    routes() {
        this.app.use('/api', indexRoutes_1.default); //ruta de prueba, deberia mostrar Index Correcto
        this.app.use('/api/movie', filmRoutes_1.default); //rutas para peliculas
        this.app.use('/api/cart', cartRoutes_1.default); //rutas para carrito 
        this.app.use('/api/customer', customerRoutes_1.default); //rutas para cliente SIN AUTH0
        //this.app.use('/api/customer', requiresAuth(), customerRoutes);//rutas para cliente CON AUTH0
    }
    //Corre en puerto 3000 un nuevo servidor
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
