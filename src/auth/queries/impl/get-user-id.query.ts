import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";

export class GetUserIdQuery {
    constructor(
        public readonly authCredentials: AuthCredentialsDto,
    ) {}
}