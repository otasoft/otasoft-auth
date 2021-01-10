export class GenerateForgotPasswordTokenCommand {
  constructor(
    public readonly userId: number,
    public readonly userEmail: string,
  ) {}
}
