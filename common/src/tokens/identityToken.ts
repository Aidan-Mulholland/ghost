export type IdentityTokenData = {
  username: string;
  pfp: string | null;
};

export type IdentityToken = {
  iss: string;
  // id of the identity
  sub: string;
  aud: string;
  iat: string;
  exp: string;
} & IdentityTokenData;
