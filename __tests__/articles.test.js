const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("GET /api/articles", () => {
  test("200 should return articles objects each with correct key values", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200 should return articles filtered by given query topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(1);
      });
  });
  test("404 should return error when given bad topic", () => {
    badTopic = "NotATopic";
    return request(app)
      .get(`/api/articles?topic=${badTopic}`)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("topic not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200 should return comments objects for the corresponding article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });

        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200 should return empty array objects when article_id is correct but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("404 should return empty array objects when article_id given is out of range", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("article_id not found");
      });
  });
  test("400 should error handle article_id given is not in correct format", () => {
    return request(app)
      .get("/api/articles/notAArticleId/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Incorrect value given");
      });
  });
});

describe("/api", () => {
  describe("/articles", () => {
    describe("GET /:article_id", () => {
      test("200 should return articles with the corresponding article_id objects each with correct key values", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(Array.isArray(articles)).toBe(true);
            expect(articles.length).toBe(1);
            const article = articles[0];

            expect(article.author).toBe("butter_bridge");
            expect(article.title).toBe("Living in the shadow of a great man");
            expect(article.article_id).toBe(1);
            expect(article.body).toBe("I find this existence challenging");
            expect(article.topic).toBe("mitch");
            expect(typeof article.created_at).toBe("string");
            expect(article.votes).toBe(100);
            expect(typeof article.article_img_url).toBe("string");
          });
      });
      test("404 should error handle article_id is correct formate but does not exist", () => {
        return request(app)
          .get("/api/articles/99999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("article_id not found");
          });
      });
      test("400 should error handle article_id given is not in correct format", () => {
        return request(app)
          .get("/api/articles/xxxxx")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Incorrect value given");
          });
      });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("200 should return comments objects for the corresponding article_id", () => {
    const commentToAdd = {
      username: "butter_bridge",
      body: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand",
    };
    const article_id = 2;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(commentToAdd)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Object);
        expect(comments).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: commentToAdd.username,
            body: commentToAdd.body,
            article_id: article_id,
          })
        );
      });
  });
  test("400 should return error message when 'not null' key values are missing from post object", () => {
    const postMissingUserName = {
      body: "there is no compression algorithm for experience",
    };
    const postMissingBody = {
      username: "butter_bridge",
    };

    const missingUsername = request(app)
      .post("/api/articles/2/comments")
      .send(postMissingUserName)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("missing values from post object");
      });

    const missingBody = request(app)
      .post("/api/articles/2/comments")
      .send(postMissingBody)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("missing values from post object");
      });

    return Promise.all([missingUsername, missingBody]);
  });
  test("400 should return error message when article_id is not in correct format", () => {
    const commentToAdd = {
      username: "butter_bridge",
      body: "Life isn't about weathering the storm. It's about learning to dance in the rain",
    };

    return request(app)
      .post("/api/articles/NotAnArticleId/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Incorrect value given");
      });
  });
  test("404 should return error message when key values article_id do not exist", () => {
    const commentToAdd = {
      username: "butter_bridge",
      body: "The person who falls in love with the walking will walk further than the person who loves destination",
    };

    return request(app)
      .post("/api/articles/999999999/comments")
      .send(commentToAdd)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("key value given do not exist");
      });
  });
  test("404 should return error message when key values username do not exist", () => {
    const commentToAddWithIncorrectUsername = {
      username: "NOT A REAL USERNAME",
      body: "A smooth sea never made a skilled sailor",
    };

    return request(app)
      .post("/api/articles/3/comments")
      .send(commentToAddWithIncorrectUsername)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("key value given do not exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  //TODO go through https://github.com/deanlicious/nc-news/pull/10#pullrequestreview-1829322332

  test("200 should return comments objects for the corresponding article_id", () => {
    const votePatch = {
      inc_votes: 42,
    };
    const article_id = 1;

    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(votePatch)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Object);
        expect(articles).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: article_id,
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: 142,
            article_img_url: expect.any(String),
            body: expect.any(String),
          })
        );
      });
  });
  test("400 return error for missing inc_votes from PATCH", () => {
    const article_id = 1;

    return request(app)
      .patch(`/api/articles/${article_id}`)

      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("missing values from post object");
      });
  });
  test("400 return error for inc_votes value from PATCH, or article_id not correct type", () => {
    const incorrect_article_id = request(app)
      .patch(`/api/articles/notCorrectArticleId`)
      .send({
        inc_votes: 42,
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Incorrect value given");
      });

    const incorrect_inc_votes = request(app)
      .patch(`/api/articles/notCorrectArticleId`)
      .send({
        inc_votes: "Not in correct form",
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Incorrect value given");
      });

    return Promise.all([incorrect_article_id, incorrect_inc_votes]);
  });
  test("404 return error for article_id does not exist", () => {
    const outOfRange_article_id = 99999999;

    return request(app)
      .patch(`/api/articles/${outOfRange_article_id}`)
      .send({
        inc_votes: 42,
      })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("article_id not found");
      });
  });
});
