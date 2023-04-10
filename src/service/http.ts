import type { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@ngify/http'
import { HttpClient, HttpEventType } from '@ngify/http'
import { useLocalStorage } from '@vueuse/core'
import { Notify } from 'quasar'
import type { Observable } from 'rxjs'
import { tap } from 'rxjs'
import { AuthService } from './auth/auth.service'

const access_token = useLocalStorage('access_token', '')

export const http = new HttpClient([
  new class implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      // 克隆请求以修改请求参数
      request = request.clone({
        url: `/api/${request.url}`,
        headers: request.headers.set('Authorization', `Bearer ${access_token.value}`),
      })

      return next.handle(request)
    }
  }(),
  {
    intercept(request: HttpRequest<unknown>, next: HttpHandler) {
      // 添加 query 参数
      // request = request.clone({
      //   params: request.params.set('k', 'v'),
      // })

      console.log('拦截后的请求', request)

      const hd$ = next.handle(request)

      hd$.subscribe({
        error: (err) => {
          const { error } = err
          console.log('http 订阅的错误响应 err', err)
          if (error.statusCode === 401 && error.message === 'Unauthorized')
            AuthService.getInstance().logout()
          if (error.statusCode > 299 || error.statusCode < 200) {
            console.log('error.message', error.message)
            Notify.create({ position: 'center', message: error.message })
          }
        },
      })

      return hd$.pipe(
        tap((response) => {
          // @ts-expect-error
          if (response.type === HttpEventType.Response)
            console.log('拦截后的响应', response)
        }),
      )
    },
  },
])
