// Stats response type
export interface Stats {
    total_income: number;
    total_expense: number;
    balance: number;
    transaction_count: number;
    status: string;
}

// Transaction type
export interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    transaction_date: string;
    created_at?: string;
    updated_at?: string;
}

// Form data for creating/updating transactions
export interface TransactionFormData {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    transaction_date: string;
}
