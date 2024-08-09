export type RefreshToken = {
  iss: string;
  iat: number;
  // email of the identity
  sub: string;
  aud: string;
  exp: number;
};
