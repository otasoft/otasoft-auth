import { SignInHandler } from './auth/sign-in.handler';
import { SignUpHandler } from './auth/sign-up.handler';
import { ConfirmAccountCreationCommandHandler } from './user/confirm-account-creation.handler';
import { ChangeUserPasswordHandler } from './user/change-user-password.handler';
import { DeleteUserAccountHandler } from './user/delete-user-account.handler';

export const CommandHandlers = [
  SignInHandler,
  SignUpHandler,
  ConfirmAccountCreationCommandHandler,
  ChangeUserPasswordHandler,
  DeleteUserAccountHandler,
];
