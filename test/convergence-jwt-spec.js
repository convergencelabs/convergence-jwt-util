'use strict';

const fs = require('fs-extra');
const JwtGenerator = require('../dist/convergence-jwt');

const jwt  = require('jsonwebtoken');
const should = require('should');

describe('ConvergenceJwtGenerator', function () {

  it('correctly create a valid JWT', function () {
    const privateKey = fs.readFileSync('test/private.key');
    const publicKey = fs.readFileSync('test/public.key');

    const gen = new JwtGenerator("testKey", privateKey);
    const token = gen.generate("test-user", {roles: ['r1', 'r2']});

    const opts = {
      audience: "Convergence",
      issuer: "ConvergenceJwtGenerator",
      subject: "test-user"
    };

    jwt.verify(token, publicKey, opts, function(err, decoded) {
      should.not.exist(err);
      should(decoded.roles).deepEqual(['r1', 'r2']);
      should(decoded.sub).equal("test-user");
      should(decoded.iss).equal(opts.issuer);
      should(decoded.aud).equal(opts.audience);
    });
  });
});
