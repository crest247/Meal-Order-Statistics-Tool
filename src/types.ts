export type Meal = {
    id: string;
    name: string;
    price: number;
};

export type DraftItem = {
    id: string;
    meal: Meal;
    quantity: number;
    subtotal: number;
};

export type UserOrder = {
    id: string;
    filler_name: string;
    items: DraftItem[];
    total_price: number;
    _summary?: string; // For data from Google Sheets that might not have full item detail
};
