const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("/api", () => {
  describe("/articles", () => {
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
        expect(msg).toEqual("Invalid id type");
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
            expect(body.msg).toBe("Invalid id type");
          });
      });
    });
  });
});
