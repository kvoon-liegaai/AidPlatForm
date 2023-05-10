export enum Role {
  Root = 'root',
  User = 'user',
  Admin = 'admin',
}

export interface UserModel {
  id: number
  username: string // 用户名
  nickname: string // 昵称
  // password: string // 密码
  avatar: string
  email: string
  role: Role // 用户角色
  createTime: Date
  updateTime: Date
  describe: string
}

export interface LoginParams extends Pick<UserModel, 'username'> {
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface SignUpParams extends Pick<
  UserModel,
  'username' |
  'nickname' |
  'email' |
  'role'
> {
  password: string
}
