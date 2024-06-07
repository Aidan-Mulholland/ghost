import { Roles } from "../roles";
import { z } from "zod";

export type AccessToken = {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  scope: string[];
  roles: Roles[];
};
