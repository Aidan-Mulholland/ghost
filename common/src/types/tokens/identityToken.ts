export type IdentityToken = {
  iss: string;
  sub: string;
  aud: string;
  iat: string;
  exp: string;
  name: string;
  email: string;
  picture?: string;
};
