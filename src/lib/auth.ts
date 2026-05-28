export interface AppUser {
  username: string
  password: string
  name: string
  email: string
  role: string
}

export const TEST_USERS: AppUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Admin',
    email: 'admin@equipepro.com',
    role: 'Administrador',
  },
  {
    username: 'usuario',
    password: 'usuario123',
    name: 'Usuario Padrao',
    email: 'usuario@equipepro.com',
    role: 'Usuario',
  },
]

export const DEFAULT_USER = TEST_USERS[0]
