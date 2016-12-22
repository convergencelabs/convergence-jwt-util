# Convergence JWT Generator
This project helps users easily create a JavaScript Web Token (JWT) for logging into Convergence.  JWTs allow Convergnece to trust that an external system has properly authenticated a user.  Convergence uses asymetric RSA Public / Private keys to generate JWTs. Convergence will store your public key.  You must store your private key in a safe place.  The public / private key pair sets up trust between your application and Convergence.

You can learn more about JWTs at [http://jwt.io](http://jwt.io)

To create a JWT key for your domain log into the [Convergence Administration Console](https://convergence.io). If you have questions about generating a JWT Key Pair please consult the [Convergence Developer Guide](https://docs.convergence.io/guide/)

## Installation
`npm install --save convergence-jwt`

## Example Usage
The below demonstrates how you can generate a JWT in node using a private key stored on the filesystem.

```js
var fs = require('fs');
var JwtGenerator = require('../dist/convergence-jwt');

// replace with your private key
var privateKey = fs.readFileSync('test/private.key');

// Replace with your key id
var keyId = "my-convergence-key"

var gen = new JwtGenerator(keyId, privateKey);

// Provide optional information about the uers.
var claims = {
  firstName: "John",
  lastName: "Doe"
};

// Provide the username
var username = "jdoe";

// Generate the token
var token = gen.generate(username, claims);
```