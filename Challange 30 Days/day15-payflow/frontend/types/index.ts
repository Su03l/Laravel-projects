export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  bank_details?: BankDetails;
  personal_info: PersonalInfo;
  joined_at: string;
}

export interface BankDetails {
  account_number: string;
  iban: string;
  current_balance: string; // "1000.00 SAR"
}

export interface PersonalInfo {
  national_id: string;
  dob: string;
}

export interface Beneficiary {
  id: number;
  name: string;
  alias_name?: string;
  account_number: string;
  iban: string;
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  direction: "In" | "Out";
  other_party: string;
  description?: string;
  date: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  data: User;
}

export interface BeneficiariesResponse {
  data: Beneficiary[];
}

export interface TransactionsResponse {
  data: Transaction[];
}
