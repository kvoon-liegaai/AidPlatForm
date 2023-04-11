import type { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@ngify/http'
import { HttpClient, HttpEventType } from '@ngify/http'
import { useLocalStorage } from '@vueuse/core'
import { Notify } from 'quasar'
import { EMPTY, catchError, tap } from 'rxjs'
import type { Observable } from 'rxjs'
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

      return next.handle(request).pipe(
        tap((response) => {
          // @ts-expect-error
          if (response.type === HttpEventType.Response)
            console.log('拦截后的响应', response)
        }),
        catchError((err: HttpErrorResponse) => {
          if (!err.ok) {
            console.error('err.statusText', err.statusText)
            Notify.create({ type: 'negative', position: 'center', message: err.statusText })
          }
          const { error } = err
          console.log('http 订阅的错误响应 err', err)
          if (error.statusCode === 401 && error.message === 'Unauthorized')
            AuthService.getInstance().logout()
          if (error.statusCode > 299 || error.statusCode < 200) {
            console.log('error.message', error.message)
            Notify.create({ position: 'center', message: error.message[0] })
          }
          return EMPTY
        }),
      )
    },
  },
])
