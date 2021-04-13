# auth-sockets-starter

Simple template node.js app that gets some of the authorization logic and boilerplate in place.
* The login endpoint does not perform any authentication. Use passport or another provider.
* /auth/login provides an access token and a refresh token.
* /auth/refresh requires a refresh token and provides a new access token.
* Express controllers which set ```public requireAuthHeader = true;``` require the access token by default.
* Socket connections require authorization with the access token.

Note that this is implemented as a single service that authenticates and consumes the tokens, but the auth controller can also be implemented as a standalone service.
