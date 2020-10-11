export class ChangePasswordDto {
    id: number;
    changePasswordDto: {
        old_password: string;
        new_password: string;    
    }
}