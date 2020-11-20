import { ChangePasswordDto } from '../../dto';

export class ChangeUserPasswordCommand {
  constructor(public readonly changePasswordDto: ChangePasswordDto) {}
}
