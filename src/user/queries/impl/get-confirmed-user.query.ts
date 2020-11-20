import { AuthConfirmationDto } from '../../dto';

export class GetConfirmedUserQuery {
  constructor(public readonly authConfirmationDto: AuthConfirmationDto) {}
}
