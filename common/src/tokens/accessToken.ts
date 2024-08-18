import { Roles } from "../roles";

export type AccessToken = {
  iss: string;
  // email of the identity
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  scope: string[];
  roles: Roles[];
};
