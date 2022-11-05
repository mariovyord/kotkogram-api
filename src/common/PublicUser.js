class PublicUser {
    constructor(user) {
        this._id = user._id.toString();
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.description = user.description;
        this.following = user.following.map(x => x.toString());
        this.imageUrl = user.imageUrl;
    }
}

module.exports = PublicUser;