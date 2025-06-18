export type Permission =
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'contest:read'
  | 'contest:write'
  | 'contest:delete'
  | 'contestant:read'
  | 'contestant:write'
  | 'contestant:delete'
  | 'submission:read'
  | 'submission:write'
  | 'submission:delete'
  | 'statistics:read'
  | 'settings:read'
  | 'settings:write'
  | 'logs:read';

export const PERMISSIONS = {
  USER: {
    READ: 'user:read' as Permission,
    WRITE: 'user:write' as Permission,
    DELETE: 'user:delete' as Permission,
  },
  CONTEST: {
    READ: 'contest:read' as Permission,
    WRITE: 'contest:write' as Permission,
    DELETE: 'contest:delete' as Permission,
  },
  CONTESTANT: {
    READ: 'contestant:read' as Permission,
    WRITE: 'contestant:write' as Permission,
    DELETE: 'contestant:delete' as Permission,
  },
  SUBMISSION: {
    READ: 'submission:read' as Permission,
    WRITE: 'submission:write' as Permission,
    DELETE: 'submission:delete' as Permission,
  },
  STATISTICS: {
    READ: 'statistics:read' as Permission,
  },
  SETTINGS: {
    READ: 'settings:read' as Permission,
    WRITE: 'settings:write' as Permission,
  },
  LOGS: {
    READ: 'logs:read' as Permission,
  },
};

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    PERMISSIONS.USER.READ,
    PERMISSIONS.USER.WRITE,
    PERMISSIONS.USER.DELETE,
    PERMISSIONS.CONTEST.READ,
    PERMISSIONS.CONTEST.WRITE,
    PERMISSIONS.CONTEST.DELETE,
    PERMISSIONS.CONTESTANT.READ,
    PERMISSIONS.CONTESTANT.WRITE,
    PERMISSIONS.CONTESTANT.DELETE,
    PERMISSIONS.SUBMISSION.READ,
    PERMISSIONS.SUBMISSION.WRITE,
    PERMISSIONS.SUBMISSION.DELETE,
    PERMISSIONS.STATISTICS.READ,
    PERMISSIONS.SETTINGS.READ,
    PERMISSIONS.SETTINGS.WRITE,
    PERMISSIONS.LOGS.READ,
  ],
  user: [
    PERMISSIONS.CONTEST.READ,
    PERMISSIONS.SUBMISSION.READ,
    PERMISSIONS.SUBMISSION.WRITE,
  ],
  guest: [],
};