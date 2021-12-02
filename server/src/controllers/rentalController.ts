import { Response, Request } from "express";

//Pool para queries
import pool from '../database';

class RentalController{
    public async create_rental(req: Request, res: Response): Promise<void>{
        await pool.query('INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id) VALUES ' + 
                         ' (current_date(), ? , ? , NULL, ? ) ', [req.body.inventory_id, req.body.customer_id, req.body.staff_id]);
        res.json({message: 'rental saved'});
    }
}

export const rentalController = new RentalController();