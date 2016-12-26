import * as jwt  from 'jsonwebtoken';

const ISSUER = 'ConvergenceJwtGenerator';
const AUDIENCE = 'Convergence';
const ALGORITHM = 'RS256';

/**
 * A utility class to help generate valid JSON Web Tokens for Convergence.
 */
export default class ConvergenceJwtGenerator {

  /**
   * Creates a new ConvergenceJwtGenerator that will create tokens using a particular public /
   * private key pair. The private key used must correspond to the public key with the same id
   * stored in the Convergence Domain.
   *
   * @param {string} keyId
   *     The id of the key pair within the convergence domain you are connecting to.
   *
   * @param {string} privateKey
   *     The private key to sign the tokens with.
   */
  constructor(keyId, privateKey) {
    this._keyId = keyId;
    this._key = privateKey;
    this._expiresIn = "1m";
    this._notBefore = "0m";
  }

  /**
   * Gets amount of time in the future after which the token will no longer be
   * valid. The time is represented as a string in 'zeit/ms' time.
   *
   * @see https://www.npmjs.com/package/ms
   *
   * @return {string}
   *     The expiration duration.
   */
  getExpiresIn() {
    return this._expiresIn;
  }

  /**
   * Sets the amount of time in the future after which the token will no longer be
   * valid. The time is represented as a string in 'zeit/ms' time.
   *
   * @see https://www.npmjs.com/package/ms
   *
   * @param expiresIn {string}
   *     The expiration duration.
   */
  setExpiresIn(expiresIn) {
    this._expiresIn = expiresIn;
  }

  /**
   * Gets the amount of time in the future before which the token will not be
   * valid. The time is represented as a string in 'zeit/ms' time.
   *
   * @see https://www.npmjs.com/package/ms
   *
   * @returns {string}
   *     The not before duration.
   */
  getNotBefore() {
    return this._notBefore;
  }

  /**
   * Sets the amount of time in the future before which the token will not be
   * valid. The time is represented as a string in 'zeit/ms' time.
   *
   * @see https://www.npmjs.com/package/ms
   *
   * @param notBefore {string}
   *     The not before duration.
   */
  setNotBefore(notBefore) {
    this._notBefore = notBefore;
  }

  /**
   * The PEM encoded private key that will be used to sign the JWT.
   *
   * @returns {string}
   *     The private key.
   */
  getPrivateKey() {
    return this._key;
  }

  /**
   * Gets the keyId that will be encoded into the JWT.
   *
   * @returns {string}
   *     The key id.
   */
  getKeyId() {
    return this._keyId;
  }

  /**
   * Creates a token for the given username and encodes specific claims.
   *
   * @param {string} username
   *     The username of the domain user that to authenticate.
   * @param {Object} claims
   *     The claims about the user to assert.
   * @return {string}
   *     The encoded and signed token.
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

    return jwt.sign(claims, this._key, options);
  }
}
