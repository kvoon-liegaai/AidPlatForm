import { Observable } from 'rxjs'

export function getReGeo(lnglat: AMap.LngLat): Observable<any> {
  return new Observable((observer) => {
    window.Geocoder.getAddress(lnglat, (status: any, result: any) => {
      console.log('status', status)
      console.log('Geocoder.getAddress result: ', result)
      if (status === 'complete' && result.info === 'OK') {
        observer.next(result.regeocode)
        observer.complete()
      }
      else {
        observer.error(result)
      }
    })
  })
}
