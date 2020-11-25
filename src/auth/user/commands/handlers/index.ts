import { ConfirmAccountCreationCommandHandler } from './confirm-account-creation.handler';
import { ChangeUserPasswordHandler } from './change-user-password.handler';
import { DeleteUserAccountHandler } from './delete-user-account.handler';
import { RemoveRefreshTokenHandler } from './remove-refresh-token.handler';

export const CommandHandlers = [
  ConfirmAccountCreationCommandHandler,
  ChangeUserPasswordHandler,
  DeleteUserAccountHandler,
  RemoveRefreshTokenHandler,
];
