const roles = ["admin", "mod", "user"] as const;
export type Roles = (typeof roles)[number];
