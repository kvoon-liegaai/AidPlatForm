import type { Observable } from 'rxjs'
import { mergeMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { ajax } from 'rxjs/ajax'

export enum AdpApi {
  login = '/api/auth/login',
  register = '/api/user/register',
}

export enum Role {
  Root = 'root',
  User = 'user',
  Admin = 'admin',
}

export interface UserModel {
  id: number
  username: string // 用户名
  nickname: string // 昵称
  password: string // 密码
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

export function login(username: string, password: string): Observable<LoginResponse> {
  return fromFetch(AdpApi.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .pipe(
      mergeMap((response) => {
        console.log('response', response)
        if (!response.ok)
          throw new Error('Login failed')

        else if (response.status === 204)
          throw new Error('not find user')

        return response.json()
      }),
    )
}

export function signUp(params: SignUpParams) {
  return ajax({
    url: AdpApi.register,
    method: 'POST',
    body: params,
  })
}
