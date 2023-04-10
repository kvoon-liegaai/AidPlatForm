import type { Observable } from 'rxjs'
import { mergeMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'
import { ajax } from 'rxjs/ajax'
import type { LoginResponse, SignUpParams } from './auth.model'

export enum AdpApi {
  login = '/api/auth/login',
  register = '/api/user/register',
}

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
