const mongoose = require('mongoose');

module.exports = (err) => {
    if (Array.isArray(err)) {
        return err;
    } else if (err instanceof mongoose.Error) {
        return Object.values(err.errors).map(e => e.message);
    } else if (typeof err === 'string') {
        return [err];
    } else if (err.message) {
        return [err.message]
    } else {
        return ['Request error']
    }
}