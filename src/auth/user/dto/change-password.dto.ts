export class ChangePasswordDto {
  id: number;
  changePasswordData: {
    old_password: string;
    new_password: string;
  };
}
