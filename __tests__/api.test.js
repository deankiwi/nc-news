const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const { hasSimilarStructure } = require("./api.test.helper");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("/api", () => {
  test("should return a object describing all available end points with key value .description, .queries, and .exampleResponse", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).toBeGreaterThan(0);
        for (const key in body) {
          expect(body[key]).toHaveProperty("description");
          expect(body[key]).toHaveProperty("queries");
          expect(body[key]).toHaveProperty("exampleResponse");
        }
      });
  });
  test("should only contain runnable endpoints with exampleResponse containing a similar structure to response on endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        endPointRequests = [];
        for (const key in body) {
          const path = key.split(" ")[1];
          const expectedResponseStyle = body[key].exampleResponse;
          endPointRequests.push(
            request(app)
              .get(path)
              .expect(200)
              .then((endPointData) => {
                const bodyFromEndpoint = endPointData.body;

                expect(
                  hasSimilarStructure(expectedResponseStyle, bodyFromEndpoint)
                ).toBe(true);
              })
          );
        }
        return Promise.all(endPointRequests);
      });
  });
});
