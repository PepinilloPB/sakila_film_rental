import { Response, Request } from "express";

//Pool para queries
import pool from '../database';

class RentalController{
    public async create_rental(req: Request, res: Response): Promise<void>{
        await pool.query('INSERT INTO rental SET ?', [req.body]);
        res.json({message: 'rental saved'});
    }
}

export const rentalController = new RentalController();