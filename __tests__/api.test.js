const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoint = require("../endpoints.json");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("/api", () => {
  test("should return a object describing all available end points with key value .description, .queries, and .exampleResponse", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoint);
      });
  });
});
