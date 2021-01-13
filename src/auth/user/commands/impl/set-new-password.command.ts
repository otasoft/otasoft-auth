export class SetNewPasswordCommand {
  constructor(
    public readonly newPassword: string,
    public readonly userId: number,
  ) {}
}
