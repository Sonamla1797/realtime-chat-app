export type UserAuthPayload = {
    id: string;
    email: string;
};
  
export type LoginRequest = {
    email: string;
    password: string;
};
  
export type SignupRequest = {
    username: string;
    email: string;
    password: string;
};