const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => db.end());

beforeEach(() => seed(data));

describe("DELETE /api/comments/:comment_id", () => {
  test("204 should delete a comment and return back comment that was deleted", () => {
    const comment_id = 13;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments WHERE comment_id = 13;`);
      })
      .then(({ rows }) => {
        expect(rows).toEqual([]);
      });
  });
  test("400 bad comment_id given", () => {
    const comment_id = "Bad_comment_id";
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect value given");
      });
  });
  test("404 comment_id does not exist", () => {
    const comment_id = 9999999;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id given does not exist");
      });
  });
});
