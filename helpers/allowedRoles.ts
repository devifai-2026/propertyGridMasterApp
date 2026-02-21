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
