import { ConfirmAccountCreationCommandHandler } from './confirm-account-creation.handler';
import { ChangeUserPasswordHandler } from './change-user-password.handler';
import { DeleteUserAccountHandler } from './delete-user-account.handler';

export const CommandHandlers = [
  ConfirmAccountCreationCommandHandler,
  ChangeUserPasswordHandler,
  DeleteUserAccountHandler,
];
