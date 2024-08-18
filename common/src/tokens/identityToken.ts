export type IdentityToken = {
  iss: string;
  // id of the identity
  sub: string;
  aud: string;
  iat: string;
  exp: string;
  name: string;
  email: string;
  picture?: string;
};
