import { AuthConfirmationDto } from "src/local-auth/dto/auth-confirmation.dto";

export class GetConfirmedUserQuery {
    constructor(
        public readonly authConfirmationDto: AuthConfirmationDto,
    ) {}
}