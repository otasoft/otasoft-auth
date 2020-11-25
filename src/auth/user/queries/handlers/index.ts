import { GetConfirmedUserHandler } from './get-confirmed-user.handler';
import { GetRefreshUserHandler } from './get-refresh-user.handler';
import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserIdHandler } from './get-user-id.handler';

export const QueryHandlers = [
  GetUserIdHandler,
  GetConfirmedUserHandler,
  GetRefreshUserHandler,
  GetUserByEmailHandler,
  GetUserByIdHandler,
];
