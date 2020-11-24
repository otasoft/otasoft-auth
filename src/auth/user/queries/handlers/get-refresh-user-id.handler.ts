import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";

import { PasswordUtilsService } from "../../../../utils/password-utils";
import { UserRepository } from "../../../../db/repositories";
import { RpcExceptionService } from "../../../../utils/exception-handling";
import { GetRefreshUserIdQuery } from "../impl";
import { AuthIdModel } from "../../models";

QueryHandler(GetRefreshUserIdQuery)
export class GetRefreshUserIdHandler implements IQueryHandler<GetRefreshUserIdQuery> {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly rpcExceptionService: RpcExceptionService,
        private readonly passwordUtilsService: PasswordUtilsService,
    ) {}

    async execute(query: GetRefreshUserIdQuery): Promise<AuthIdModel> {
        const { id, hashedRefreshToken } = await this.userRepository.findOne({ where: { email: query.getRefreshUserIdDto.email } });

        if (!id) this.rpcExceptionService.throwNotFound('User not found');

        const isRefreshTokenMatching = await this.passwordUtilsService.compareContent(
            query.getRefreshUserIdDto.refreshToken,
            hashedRefreshToken,
        );

        return isRefreshTokenMatching ? { auth_id: id } : null
    }
}