# Northcoders News API

This repository contains the Northcoders News API, which provides access to articles stored in a SQL database through URL endpoints, returning them in JSON format.

## Installation

Before getting started, ensure you have the following software installed:

- [git](https://git-scm.com/downloads)
- [node.js](https://nodejs.org/en/download)
- [PostgreSQL](https://postgresapp.com/downloads.html)

Clone the repository:

```
>> git clone https://github.com/deanlicious/nc-news.git
```

Install dependencies:

```
>> npm install
```

Create environment variables in project root:

```
>> echo "PGDATABASE=nc_news_test" > .env.test
>> echo "PGDATABASE=nc_news" > .env.development
```

Seed date into the database:

```
>> npm run setup-dbs
>> npm run seed
```

##### Run Testing

```
>> npm test
```

##### Run Development

```
>> npm run start
```

## API DOCUMENTATION

For detailed information, refer to [endpoint.json](/endpoints.json)

- `GET /api`
- `GET /api/topics`
- `GET /api/articles`
- `GET /api/articles/:article_id`
- `PATCH /api/articles/:article_id`
- `GET /api/articles/:article_id/comments`
- `POST /api/articles/:article_id/comments`
- `DELETE /api/comments/:comment_id`
- `GET /api/users`

## DATABASE LAYOUT

#### topics Table

| Column      | References |
| ----------- | ---------- |
| slug (PK)   | -          |
| description | -          |

#### users Table

| Column        | References |
| ------------- | ---------- |
| username (PK) | -          |
| name          | -          |
| avatar_url    | -          |

#### articles Table

| Column          | References      |
| --------------- | --------------- |
| article_id (PK) | -               |
| title           | -               |
| topic (FK)      | topics(slug)    |
| author (FK)     | users(username) |
| body            | -               |
| created_at      | -               |
| votes           | -               |
| article_img_url | -               |

#### comments Table

| Column          | References           |
| --------------- | -------------------- |
| comment_id (PK) | -                    |
| body            | -                    |
| article_id (FK) | articles(article_id) |
| author (FK)     | users(username)      |
| votes           | -                    |
| created_at      | -                    |

## TODO

- [x] write code for back-end
- [ ] write code for front-end

## CONTACT INFORMATION

[Dean Welch - LinkedIn](https://www.linkedin.com/in/dean-welch/)
