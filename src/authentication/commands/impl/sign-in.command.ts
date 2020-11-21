import { AuthCredentialsDto } from '../../dto';

export class SignInCommand {
  constructor(public readonly authCredentials: AuthCredentialsDto) {}
}
