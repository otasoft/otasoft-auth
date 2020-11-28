import { AuthCredentialsDto } from '../../dto';

export class SignUpCommand {
  constructor(public readonly authCredentials: AuthCredentialsDto) {}
}
