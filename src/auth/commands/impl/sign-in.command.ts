import { AuthCredentialsDto } from "src/auth/dto/auth-credentials.dto";

export class SignInCommand {
    constructor(
        public readonly authCredentials: AuthCredentialsDto,
    ) {}
}