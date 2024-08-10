# Auth

This doc outlines my approach to user authentication and authorization for Ghost. Keep in mind this is a solo project aimed mainly at being something to help me learn and not something intended for production, so there may be mistakes in my understanding and/or implementation. Any feedback is appreciated.

## Overview

The auth server provides authentication and authorization functionality for various Ghost clients to use. These endpoints are consumed by clients to perform actions such as

* Login
* Sign up
* Log out

The auth server also provides endpoints for token introspection which are consumed only by the resource server for authorization.

## Endpoints

### /login (POST)

This endpoint provides login functionality, taking email and password as inputs. It then finds the account with the associated email (returns 404 if not found), compares the hashed password with the provided password (returns 403 if incorrect) and then generates an access token, refresh token and identity token, setting these as cookies in the client.

### /signup (POST)

This endpoint provides signup functionality, creating a new user with the provided credentials and generating the same cookies as the login endpoint.

### /token (POST)

This endpoint is used by the client to get a new access token using a valid refresh token. The server verifies the refresh token, ensures it is not revoked and then issues a new access token with the same permissions as in the refresh token.

### /validate (POST)

This endpoint is used for token introspection by the resource server to verify that a token is valid. It will also be expanded to ensure the authorisation level is correct. 

### /revoke (POST)

Following [RFC7009](https://datatracker.ietf.org/doc/html/rfc7009), I implemented a /revoke endpoint on the Authentication server to revoke access tokens and refresh tokens. This adds
