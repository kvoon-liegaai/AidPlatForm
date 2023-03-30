import { BehaviorSubject, combineLatest, switchMap } from 'rxjs'
import { regeo2IGeo } from 'src/utils/map'

export class GeoService {
  // 注意这个是私有的, 组件不需要关心这个.
  private regeoNeedsUpdate = new BehaviorSubject(false)
  private lnglat = new BehaviorSubject(new AMap.LngLat(113.922869, 22.515923))

  public geo = combineLatest([
    this.lnglat,
    this.regeoNeedsUpdate,
  ])
    .pipe(
      switchMap(([lnglat]) => {
        return regeo2IGeo(lnglat)
      }),
    )

  public updateLngLat(lnglat: AMap.LngLat) {
    console.log('geo.service updateLnglat', lnglat)
    this.lnglat.next(lnglat)
  }

  public refresh() {
    this.regeoNeedsUpdate.next(true)
  }
}
