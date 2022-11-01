# **REST API for Kotkogram Web App**

Kotkogram is like Instagram... but for cats!

The REST API powers the app by providing users and data service. Data is stored in MongoDB Atlas.

For educational purposes only!

## **Demo**

> <https://kotkogram-api.herokuapp.com/api>

## **Response structure**

```js
{
    code: number,
    message: string,
    data: { [key: string]: any } | undefined,
    errors: string[] | undefined,
}
```

## **Root**

- Route: `/api` returns REST API meta data.

## **Authorized Requests**

Some of the endpoints require for you to make authorized requests (marked below). To do so, you need to login first and the API will return a jwt token in http-only cookie. The browser automatically will attach the cookie with every request.

## **User service**

`GET /api/users` - Returns endpoints.

### Sign up

- `POST /api/users/signup` - Create new user. For User model check below. Returns created user's data and a jwt token in http-only cookie. If error occurs, returns `status 400`.

### Log in

- `POST /api/users/login` - Log in user with `username` and `password`. Returns user's data and a jwt token in http-only cookie. If error occurs, returns `status 401`.

### Log out

- `DELETE /api/users/logout` - Clears jwt cookie. **Authorized request!**

### Check if jwt token is valid

- `/api/users/me` - Returns user's data if jwt token is valid. Otherwise returns `status 401` or `status 403`. **Authorized request!**

### Get user's data

- `GET /api/users/:_id` - Returns data for user with matching ID. Limited to publicly available information. If no data is found, returns `status 404`. **Authorized request!**

### Edit user's data

- `PATCH /api/users/:_id` - Edit user's data. For owners only. If error occurs, returns `status 400`. **Authorized request!**

## **Data service**

Basic structure: `'/api/collections/:collection/:_id'`

### GET

- `GET /api/collections/:collection` - Returns array of objects. Returns status 404 if there are no results.
- `GET /api/collections/:collection/:id` - Returns an object. Returns status 404 if there are is no result.

### POST

- `POST /api/collections/:collection` - Creates new item in the chosen collection. Returns the created item. **Authorized request!**

### PATCH

- `PATCH /api/collections/:collection/:_id` - Update item with matching ID. Returns the updated item. **Authorized request!**

### DELETE

- `DELETE /api/collections/:collection/:_id` - Delete item with matching ID. Returns `status 202`. **Authorized request!**

### LIKE

- `POST /api/collections/:collection/:_id/like` - Like or remove like (if its already liked) for item in collection. User's ID is automatically extracted from jwt cookie, so there is no need to put anything in request body. **Authorized request!**

## **Query parameters**

### Multiple query parameters of the same type

You can put multiple queries of the same type.

Example:

```http
GET /api/collections/posts/62cd7b659032c071e10e4f8e?populate=owner&populate=post
```

### SORT

Append URL encoded string `sortBy={property asc/desc}` to the query parameters to sort by property name in ascending (`asc`) or descending (`desc`) order.

Example:

```http
(unencoded) /api/collections/posts?sortBy=createdAt desc
GET /api/collections/posts?sortBy=createdAt%20desc
```

### SEARCH

Append URL encoded string `where={property=value}` to the query parameters. Only full matches will be returned.

Example:

```http
(unencoded) /api/collections/posts?where=owner=8f414b4fab394d36bedb2ad69da9c830
GET /api/collections/posts?where=owner%3D%228f414b4fab394d36bedb2ad69da9c830%22
```

### PAGINATION

*By default the service returns 10 entries.*

Append `page={pageNumber}&pageSize={entries}` to the query parameters, where `{pageNumber}` is the number of entries to skip and `{entries}` is the number of entries to return.

Example: Second page of entries from the answers collection, assuming 10 entries per page:

```http
GET /api/collections/posts?page=2&pageSize=10
```

### POPULATE

Append `populate={property}` to the query parameters, where `{property}` is the property you want to populate with data.
Example:

```http
GET /api/collections/posts/62cd7b659032c071e10e4f8e?populate=owner
```

### COUNT

Append `count=true` to the query parameters. It can be combined with `SEARCH` query.
Example:

```http
GET /api/collections/posts?count=true
```

### SELECT

Append `select={property}` to the query parameters, where `{property}` is the property you want to select. You can add multiple properties, separated by space.
Example:

```http
GET /api/collections/answers?select=owner
```

## **Data models**

### User Model

```js
{
    username: string,
    firstName: string,
    lastName: string,
    password: string, // hashed on save
    description: string, // optional
    imageUrl: string, // optional
    following: ObjectId[], ref: 'User'
    role: ['user', 'moderator', 'admin']
}
```

### Post model

```js
{
    imageUrl: string,
    description: string,
    owner: ObjectId, ref: 'User'
    likes: ObjectId[], ref: 'User'
}
```

### Comment model

```js
{
    body: string,
    owner: ObjectId, ref: 'User'
    post: ObjectId, ref: 'Post'
}
