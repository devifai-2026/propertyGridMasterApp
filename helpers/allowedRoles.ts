// NOTE: "Owner" is a valid role for accounts that already exist on the backend,
// but there is NO self-signup path for Owner — the signup `joinType` only
// supports "investor" and "broker" (see SignupScreen). Owner accounts are
// provisioned server-side, not via the public signup form. Do not add an
// "Owner" option to the signup UI until the backend exposes that endpoint.
export enum UserRole {
  OWNER = 'Owner',
  BROKER = 'Broker',
  INVESTOR = 'Investor',
}

export const allowedRoles: string[] = [
  UserRole.OWNER,
  UserRole.BROKER,
  UserRole.INVESTOR,
];
