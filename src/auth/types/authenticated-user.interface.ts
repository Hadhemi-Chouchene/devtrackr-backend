import { Role } from 'src/common/enums/role.enum';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}
