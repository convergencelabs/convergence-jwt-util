'use strict';

var fs = require('fs');
var JwtGenerator = require('../dist/convergence-jwt');

var jwt  = require('jsonwebtoken');
var should = require('should');

var assert = require('should');

var key = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCishDxrAVKG9hyqX3jhl2uSbaRI4ibsBj6KHDDNuPJcuSuXXAzQoAbFXXFkOi8OkUb07vdEdybBHYy1F0F5oKZnz0adZSIr1UP7U4Xfp7xfi4v2l6HE7bReICyspqLg7rXf6LwU6WeOZI44E7Ka/ncMTcXMlhDPVudpdlFRct+KtFV87ih0ewkyIgrmNn1NsLi2ImJvGdMt73Z2NSLPSFblIncRn2Xxh7oWza98FMvBPZJzpBpY2onMu4iybS95ixb3VGxggiCV3rkEzGkI4rkWe7gvsbdaQZG1NN4c6c07g+YUWvD0NmlYywBkDKSVsU52ImFOx2xjZ3QfhJq1F4fAgMBAAECggEAcJ5b9j4CB1ORF4XVm4pmDH///SWgqUxTbc5Sh/7V3JtISp5pTUJKFPVc6Z4uTCT1s5Z0I0n67989xl+T6MKwQpCkpk0fvSHI+tZkSQUgFsAmTn+VEWGHGiaUx520NsC/s+4pJrxwFz94xSAXyizF7zKuFMOHrzuo0E5+QGJYwwLZcpHY9LH4KEdE9HhdHRAu3Ah5/Ag1OUgFOtyzW3rYsUcKh5OwCiZFVffDL3XCVFNZbipG29qJppFtc78ykEUPG2YLbHXRfRlJGqZFulWU8snysxFy1YNeze6kjPqNzKI4VtriieijNvq8w1tS3SpyzoPq592UaL9p+slCMop/8QKBgQDpumznFk+FiVM7FHMBjQkraVJgIgyTR1nuYd6+NKtJq08oQZFglZkYjM79szNpP3Mk1kH5I+nvy51u8qC6Jc1sIPUpsYz0AItA7elkpQWiNP0wf2+xu+BfEX5A+f5sXCnbafXstlUvFbA2rk7W2KmujiOT6SJ7pc5F2BiOsGjPZwKBgQCyMt4jHPd/DrdqIaGFsYDJ4imY+8cvAgB0Fa4KFI4sbMZzpFJ2Zuuyhxs9uXdRhTiivvt9QvMm6ZHrQitTHXT62SUHkOTPsI7SkCf7RykncKUv77wV5g9Rltq24ge3FDMaPrFmNQpS1Hdip4jmhrpyKx5kneHhxZIU7F0zzNugiQKBgHYFehpSbMNMbafGkrA0zG2MWFlMuDbib6ns57H6HIgtpeH5AfTYdZ8s8xSumYZK0NTIEDZDCUzZ71xnzftRPWKdXc645ikL4UVfHVyB689VnIgRwY/pA8pdpfgfhHapL0WpQtJN28PT2tAxwoPAkiYfhh2ZOp1fQ0KHdRcQQ0x/AoGAIEtRsKFeRRuAp+5CXH1Hrs6a5Uuz1FQTivYm3VLOVUS9TlXYT/bk/iy4Bh6nfhGbqvrbjt7kPAgWVsFeIqjy+0cBC/b5UJ5Zs9VGOaay0Z/7f819k6Zm3k1tg7lA1rAFdtsnwTMZlNtGa42bJNQD1A72ahumxQjOKZaQaYPVxakCgYEArXiV+SpOPdW/4I+nDIwGZrC1jwzr/Czm3xcnIHKctmocLqU3ULQJjNAz8wchKFccbH6LBGyWoSoli6M1nJ8Ai8WiSt1QnF0aDNg7wqHAg3HsCAMNZWPALmUwfKzg+EHTSj2TAvs9cm0Vl5Fl9u06Ewyg6TNBbyhJTbdByro3zBo=";

describe('ConvergenceJwtGenerator', function () {

  it('correctly create a valid JWT', function () {
    var privateKey = fs.readFileSync('test/private.key');
    var publicKey = fs.readFileSync('test/public.key');

    var gen = new JwtGenerator("testKey", privateKey);
    var token = gen.generate("test-user", {roles: ['r1', 'r2']});

    var opts = {
      audience: "Convergence",
      issuer: "ConvergenceJwtGenerator",
      subject: "test-user"
    };

    jwt.verify(token, publicKey, opts, function(err, decoded) {
      should.not.exist(err);
      should(decoded.roles).deepEqual(['r1', 'r2']);
      should(decoded.subject).equal("test-user");
      should(decoded.jti).equal("testKey");
    });
  });
});