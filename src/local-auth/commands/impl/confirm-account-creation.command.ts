import { IConfirmedAccountObject } from "src/local-auth/interfaces/confirmed-acount-object.interface";

export class ConfirmAccountCreationCommand {
    constructor(
        public readonly accountConfirmObject: IConfirmedAccountObject,
    ) {}
}