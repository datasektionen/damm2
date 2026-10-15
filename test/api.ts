import { describe } from "mocha";
import { expect, use } from "chai";
import chaiHttp, { request } from "chai-http";
import { StatusCodes } from "http-status-codes";

import app from "../app";

use(chaiHttp);

describe("/api", () => {
  it("should receive 404 on invalid path", () => {
    request
      .execute(app)
      .get("/api/aaaaaaaaaaa")
      .end((err, res) => {
        expect(res.status).to.equal(StatusCodes.NOT_FOUND);
        expect(res.status).to.equal(StatusCodes.NOT_FOUND);
        expect(res.body.error).to.equal(undefined);
      });

    request
      .execute(app)
      .get("/api/blabla")
      .end((err, res) => {
        expect(res.status).to.equal(StatusCodes.NOT_FOUND);
        expect(res.status).to.equal(StatusCodes.NOT_FOUND);
        expect(res.body.error).to.equal(undefined);
      });
  });
});
