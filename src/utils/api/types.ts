export type UserRole = "user" | "supplier" | "admin" | "";

export interface LoginUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: string;
  suspensionReason: string | null;
  createdAt: string;
  postCode?: string;
  latitude?: number;
  longitude?: number;
}
