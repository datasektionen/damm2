import { describe } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';

import app from '../app';

chai.use(chaiHttp);

describe("/api", () => {
    it("should receive 404 on invalid path", () => {
        chai.request(app)
        .get("/api/aaaaaaaaaaa")
        .end((err, res) => {
            expect(res.status).to.equal(StatusCodes.NOT_FOUND);
            expect(res.status).to.equal(StatusCodes.NOT_FOUND);
            expect(res.body.error).to.equal(undefined);
        });

        chai.request(app)
        .get("/api/blabla")
        .end((err, res) => {
            expect(res.status).to.equal(StatusCodes.NOT_FOUND);
            expect(res.status).to.equal(StatusCodes.NOT_FOUND);
            expect(res.body.error).to.equal(undefined);
        });
    });
});