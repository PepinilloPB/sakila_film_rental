export interface Film{
    film_id?: number;
    title?: string;
    description?: string;
    release_year?: number;
    language?: string;
    original_language?: string;
    rental_duration?: number;
    rental_rate?: number;
    length?: number;
    replacement_cost?: number;
    rating?: string;
    special_features?: string;
    last_update?: Date;
    inventory_id?: number;
}