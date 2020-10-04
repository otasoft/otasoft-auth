import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";

export class SignUpCommand {
    constructor(
        public readonly authCredentials: AuthCredentialsDto
    ) {}
}