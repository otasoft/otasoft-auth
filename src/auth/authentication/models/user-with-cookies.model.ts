import { IAuthUser } from "../interfaces"

export class UserWithCookiesModel {
    cookies: string[];
    user: IAuthUser;
}