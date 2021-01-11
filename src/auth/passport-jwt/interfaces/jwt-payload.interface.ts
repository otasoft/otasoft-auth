export interface IJwtPayload {
  userId: number;
  userEmail: string;
  iat?: number;
  exp?: number;
}
