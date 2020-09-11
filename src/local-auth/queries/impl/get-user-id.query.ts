import { AuthCredentialsDto } from "src/local-auth/dto/auth-credentials.dto";

export class GetUserIdQuery {
    constructor(
        public readonly authCredentials: AuthCredentialsDto,
    ) {}
}