import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import filmRoutes from './routes/filmRoutes';
import cartRoutes from './routes/cartRoutes';
//import { OpenidRequest } from 'express-openid-connect';
import customerRoutes from './routes/customerRoutes';
import rentalRoutes from './routes/rentalRoutes';

//Variables de entorno (necesario si usamos auth0)
require('dotenv').config();

//Metodos de openid connect
const { auth, requiresAuth } = require('express-openid-connect');

class Server{

    //Aplicacion que correra puerto y rutas
    public app : Application;

    constructor(){
        this.app = express();
        this.config();//Seteo de puerto, morgan, cors y express
        this.routes();//Seteo de rutas 
    }
    

    config(): void{
        this.app.set('port', process.env.PORT || 3000);// Servidor en puerto 3000
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));

        //Conexion con auth0
        this.app.use(
            auth({
                authRequired: false,
                auth0Logout: true,
                issuerBaseURL: process.env.ISSUER_BASE_URL,
                baseURL: process.env.BASE_URL,
                clientID: process.env.CLIENT_ID,
                secret: process.env.SECRET
            })
        );
    }
    routes(): void{

        this.app.use('/api', indexRoutes);//ruta de prueba, deberia mostrar Index Correcto
        this.app.use('/api/movie', filmRoutes);//rutas para peliculas
        this.app.use('/api/cart', cartRoutes);//rutas para carrito 
        this.app.use('/api/customer', customerRoutes);//rutas para cliente SIN AUTH0
        this.app.use('/api/rental', rentalRoutes);//rutas para renta 
        //this.app.use('/api/customer', requiresAuth(), customerRoutes);//rutas para cliente CON AUTH0
    }
    //Corre en puerto 3000 un nuevo servidor
    start(): void{
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();