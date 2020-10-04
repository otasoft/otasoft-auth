import { AuthConfirmationDto } from "src/auth/dto/auth-confirmation.dto";

export class GetConfirmedUserQuery {
    constructor(
        public readonly authConfirmationDto: AuthConfirmationDto,
    ) {}
}