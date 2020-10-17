import { GetUserIdDto } from "src/auth/dto/get-user-id.dto";

export class GetUserIdQuery {
    constructor(
        public readonly getUserIdDto: GetUserIdDto,
    ) {}
}