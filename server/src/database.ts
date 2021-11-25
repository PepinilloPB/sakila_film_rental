import mysql from 'promise-mysql';
import keys from './keys';

//Creamos conexion a la DB 
const pool = mysql.createPool(keys.database);

pool.getConnection()
    .then(connection => {
        pool.releaseConnection(connection);
        console.log('Sakila is Connected');
    });

export default pool;