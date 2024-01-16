const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => seed(data));

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
