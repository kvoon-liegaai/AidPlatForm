import { useStorage } from '@vueuse/core'
import { BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { login } from 'src/api/adp'

export class AuthService {
  public name = 'authService'
  public access_token: Ref<string | null>
  private loggedIn: BehaviorSubject<boolean>
  private static _instance: AuthService

  private constructor() {
    this.loggedIn = new BehaviorSubject(false)
    this.access_token = useStorage('access_token', null)
  }

  public static getInstance(): AuthService {
    if (!AuthService._instance)
      AuthService._instance = new AuthService()

    return AuthService._instance
  }

  public loginAndSetToken(username: string, password: string) {
    return login(username, password)
      .pipe(
        tap((response) => {
          this.access_token.value = response.access_token
          console.log('access_token', this.access_token.value)
          this.loggedIn.next(true)
        }),
        map(() => true),
      )
  }

  public logout() {
    console.log(this)

    this.access_token.value = null
    this.loggedIn.next(false)
  }

  public isLoggedIn() {
    console.log(this)
    return this.loggedIn.asObservable()
  }

  public getToken() {
    return this.access_token
  }
}
