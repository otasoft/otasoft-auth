import { AuthEmailDto } from "src/auth/dto/auth-email.dto";

export class GetUserIdQuery {
    constructor(
        public readonly authEmailDto: AuthEmailDto,
    ) {}
}