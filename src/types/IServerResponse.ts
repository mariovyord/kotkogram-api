export interface IServerResponse {
    code: number,
    message: string,
    data: unknown,
    errors?: string[],
}