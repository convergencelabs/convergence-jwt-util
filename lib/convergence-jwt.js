/*
 * convergence-token-generator
 *
 *
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */

import * as jwt  from 'jsonwebtoken';

const ISSUER = 'ConvergenceJwtGenerator';
const AUDIENCE = 'Convergence';
const ALGORITHM = 'RS256';

/**
 * Creates a new ConvergenceTokenGenerator that will create tokens using a particular public /
 * private key pair. The private key used must correspond to the public key with the same id
 * stored in the Convergence Domain.
 *
 * @param {string} keyId
 *            The id of the key pair within the convergence domain you are connecting to.
 *
 * @param {string} privateKey
 *            The private key to sign the tokens with.
 */
export class JwtGenerator {

  constructor(keyId, privateKey) {
    this._keyId = keyId;
    this._key = privateKey;

    this._expiresIn = "1m";
    this._notBefore = "0m";
  }

  /**
   * Gets the number of minutes in the future the token will expire.
   *
   * @return the expiration minutes.
   */
  getExpiresIn() {
    return this._expiresIn;
  }

  setExpiresIn(expresIn) {
    this._expiresIn = expresIn;
  }

  getNotBeforeMinutes() {
    return this._notBefore;
  }

  setNotBeforeMinutes(notBefore) {
    this._notBefore = notBefore;
  }

  getPrivateKey() {
    return this._key;
  }

  getKeyId() {
    return this._keyId;
  }

  /**
   * Creates a token for the given username and encodes specific claims.
   *
   * @param {string} username
   *            The username of the domain user that to authenticate.
   * @param {Object} userclaims
   *            The claims about the user to assert.
   * @return {string} The encoded and signed token.
   */
  generate(username, claims) {
    if (!claims) {
      claims = {};
    }
    var reserved = ['aud', 'iat', 'sub', 'jti', 'nbf', 'exp'];

    var options = {
      algorithm: ALGORITHM,
      audience: AUDIENCE,
      issuer: ISSUER,
      expiresIn: this._expiresIn,
      notBefore: this._notBefore,
      subject: username,
      header: {
        kid: this._keyId
      }
    };

    for (var prop in Object.getOwnPropertyNames(claims)) {
      if (reserved.indexOf(prop) >= 0) {
        throw new Error('The claim name ' + prop + ' is reserved.');
      }
    }

    const token = jwt.sign(claims, this._key, options);

    return token;
  }
}