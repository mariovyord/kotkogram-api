import { ObjectId } from 'mongodb'

export interface IUser {
    _id: ObjectId,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    description?: string,
    imageUrl?: string,
    role?: string,
    createdAt?: Date;
    updateAt?: Date;
    comparePassword: (password: string) => boolean,
}