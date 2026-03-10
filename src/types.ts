export type Meal = {
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
    filler_name: string;
    timestamp: string;
    items: DraftItem[];
    total_price: number;
    _summary?: string; // For data from Google Sheets that might not have full item detail
};
