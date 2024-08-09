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

This endpoint provides login functionality, taking email and password as inputs. It then generates the password hash with salt and then

### /revoke (POST)

Following [RFC7009](https://datatracker.ietf.org/doc/html/rfc7009), I implemented a /revoke endpoint on the Authentication server to revoke access tokens and refresh tokens. This adds
