export default (err: any) => {
    if (Array.isArray(err)) {
        return err;
    } else if (typeof err === 'string') {
        return [err];
    } else if (err.message) {
        return [err.message]
    } else {
        return ['Request error']
    }
}