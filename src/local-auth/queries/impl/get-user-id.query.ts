import { SignInCredentialsDto } from "src/local-auth/dto/sign-in-credentials.dto";

export class GetUserIdQuery {
    constructor(
        public readonly signInCredentials: SignInCredentialsDto,
    ) {}
}