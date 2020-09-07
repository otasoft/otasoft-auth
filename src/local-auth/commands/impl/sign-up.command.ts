import { AuthCredentialsDto } from "src/local-auth/dto/auth-credentials.dto";

export class SignUpCommand {
    constructor(
        public readonly authCredentials: AuthCredentialsDto
    ) {}
}