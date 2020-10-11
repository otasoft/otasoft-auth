import { SignInHandler } from "./sign-in.handler";
import { SignUpHandler } from "./sign-up.handler";
import { ConfirmAccountCreationCommandHandler } from "./confirm-account-creation.handler";
import { ChangeUserPasswordHandler } from "./change-user-password.handler";
import { DeleteUserAccountHandler } from "./delete-user-account.handler";

export const CommandHandlers = [SignInHandler, SignUpHandler, ConfirmAccountCreationCommandHandler, ChangeUserPasswordHandler, DeleteUserAccountHandler];