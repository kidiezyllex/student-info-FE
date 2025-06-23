export interface ILoginBody {
  email: string;
  password: string;
}

export interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  role?: string; // Optional: "student" (default), "admin", "coordinator"
} 