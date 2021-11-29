export interface Payment{
    payment_id?: number;
    customer_id?: number;
    staff_id?: number;
    rental_id?: number;
    amount?: number;
    payment_date?: Date;
    last_update?: Date;
}