export enum Role {
  Root = 'root',
  User = 'user',
  Admin = 'admin',
}

export interface UserModel {
  id: number
  username: string // 用户名
  nickname: string // 昵称
  password?: string // 密码
  avatar: string
  email: string
  role: Role // 用户角色
  createTime: Date
  updateTime: Date
}

export type LoginParams = Pick<
  UserModel,
  'username' |
  'password'
>

export interface LoginResponse {
  access_token: string
}

export type SignUpParams = Pick<
  UserModel,
  'username' |
  'password' |
  'nickname' |
  'email' |
  'role'
>
