import { ConfirmAccountCreationCommandHandler } from '../handlers/confirm-account-creation.handler';
import { ChangeUserPasswordHandler } from '../handlers/change-user-password.handler';
import { DeleteUserAccountHandler } from '../handlers/delete-user-account.handler';

export const CommandHandlers = [
  ConfirmAccountCreationCommandHandler,
  ChangeUserPasswordHandler,
  DeleteUserAccountHandler,
];
