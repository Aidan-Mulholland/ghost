import { Roles } from "../../types/roles";

// Related to the the Auth server identity table
export type Identity = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export type IdentityWithRoles = {
  roles: Roles[];
} & Identity;
