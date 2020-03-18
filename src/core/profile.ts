export type Role = "ISSUER" | "SUPPLIER" | "INVESTOR";

export interface tokenData {
    user_id: string;
    role: Role;
}
