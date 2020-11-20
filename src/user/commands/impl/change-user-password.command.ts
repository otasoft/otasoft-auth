import { ChangePasswordDto } from 'src/auth/dto/change-password.dto';

export class ChangeUserPasswordCommand {
  constructor(public readonly changePasswordDto: ChangePasswordDto) {}
}
