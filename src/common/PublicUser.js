class PublicUser {
    constructor(user) {
        this._id = user._id.toString();
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.description = user.description;
        this.followers = user.followers;
        this.imageUrl = user.imageUrl;
    }
}

module.exports = PublicUser;