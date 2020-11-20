import { IConfirmedAccountObject } from '../../interfaces';

export class ConfirmAccountCreationCommand {
  constructor(public readonly accountConfirmObject: IConfirmedAccountObject) {}
}
