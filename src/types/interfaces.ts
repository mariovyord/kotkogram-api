import { ObjectId } from 'mongodb';


export interface IServerResponse {
    code: number,
    message: string,
    data: unknown,
    errors?: string[],
}

export interface IPost {
    imageUrl: string,
    description: string,
    owner: ObjectId | string,
    likes: (ObjectId | string)[],
}