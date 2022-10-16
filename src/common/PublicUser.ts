import { IUser } from "../types/IUser";

export class PublicUser {
    public username: string;
    public _id: string;
    public firstName: string;
    public lastName: string;
    public description: string;
    public imageUrl: string;

    constructor(user: IUser) {
        this._id = user._id.toString();
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.description = user.description!;
        this.imageUrl = user.imageUrl!;
    }
}