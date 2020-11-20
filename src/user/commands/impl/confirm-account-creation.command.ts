import { IConfirmedAccountObject } from 'src/auth/interfaces/confirmed-acount-object.interface';

export class ConfirmAccountCreationCommand {
  constructor(public readonly accountConfirmObject: IConfirmedAccountObject) {}
}
