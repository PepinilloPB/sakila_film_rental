import { Router } from "express";

import { rentalController } from "../controllers/rentalController";

class RentalRoutes{

        //Router tiene metodos http
        public router: Router = Router();

        constructor(){
            this.config();
        }
    
        config(): void{
            this.router.post("/", rentalController.create_rental);
        }
}

const rentalRoutes = new RentalRoutes();
export default rentalRoutes.router;