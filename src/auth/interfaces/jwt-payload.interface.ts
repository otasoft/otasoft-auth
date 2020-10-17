export interface IJwtPayload {
    jwt_payload: string;
    iat?: number;
    exp?: number;
} 