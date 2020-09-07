import { AuthCredentialsDto } from "src/local-auth/dto/auth-credentials.dto";

export class SignInCommand {
    constructor(
        public readonly authCredentials: AuthCredentialsDto,
    ) {}
}