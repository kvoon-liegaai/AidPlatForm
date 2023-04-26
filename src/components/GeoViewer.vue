<script setup lang='ts'>
import { Notify } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import { useGeoStore } from 'src/stores/geo'
import { LoadStatus } from 'src/types/status'
import { merge, tap } from 'rxjs'
import { fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { GeoService } from 'src/service/geo.service'
import type { IGeo, ILocation } from 'src/service/map/map.model'

const props = defineProps<{
  source?: ILocation
}>()

const geoStore = useGeoStore() // self geo location

const geoService = new GeoService()

let mapObj: AMap.Map
// let pinMarker: AMap.Marker;
const pinStatus = ref(LoadStatus.LOADING)
let selfMarker: AMap.Marker

const cardInfo = ref<IGeo>({
  address: '',
  fullAddress: '',
  lnglat: useDefaultCoords('object'),
  regeocode: {},
})

useSubscription(
  geoService.geo
    .pipe(
      tap((geo) => {
        console.log('geo', geo)
        if (geo.address === '当前位置')
          Notify.create({ message: '无效的地理位置', position: 'top' })
        else
          pinStatus.value = LoadStatus.PREPARED
      }),
    )
    .subscribe(
      toObserver(cardInfo),
    ),
)

onMounted(() => {
  let center: [number, number]

  nextTick(() => {
    if (!AMap) {
      Notify.create('地图加载失败')
      return
    }

    // init center

    // center from source exist
    if (props.source) {
      center = [props.source.longitude, props.source.latitude]
    }
    else {
      // center from self geolocation
      if (!geoStore.error && geoStore.coords.latitude !== Infinity && geoStore.coords.longitude !== Infinity)
        center = [geoStore.coords.longitude, geoStore.coords.latitude]

      // center from default geolocation
      center = useDefaultCoords('array')
      Notify.create({ message: `${geoStore.error?.code}:未获取到您的位置，已为您设置到 app 默认地址` })
      console.log('geoStore.error', geoStore.error)
    }
    console.log('center', center)

    // init map
    mapObj = new AMap.Map('map-container', {
      center,
      zoom: 16,
    })

    const targetMarker = new AMap.Marker({
      position: new AMap.LngLat(...center),
      title: cardInfo.value.address,
    })
      .addTo(mapObj)

    const circle = new AMap.Circle({
      center, // 圆心
      radius: Number(import.meta.env.VITE_MAP_RADIUS), // 半径
      strokeColor: '#FF33FF',
      strokeWeight: 6,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      strokeStyle: 'dashed',
      strokeDasharray: [10, 10],
      // 线样式还支持 'dashed'
      fillColor: '#1791fc',
      zIndex: 50,
    })

    mapObj.add(circle)
    mapObj.setFitView([circle])

    // map essential event ->  observable
    // @ts-expect-error
    const mapComplete$ = fromEvent(mapObj, 'complete')

    useSubscription(
      merge(
        mapComplete$,
        // mapMoveEnd$.pipe(debounceTime(1000)),
      )
        .subscribe(() => {
          console.log('获取中心点位置')
          geoService.updateLngLat(mapObj.getCenter())
        }),
    )

    // self marker
    if (!geoStore.error) {
      selfMarker = new AMap.Marker({ position: center })
      selfMarker.addTo(mapObj)
      watchEffect(() => {
        selfMarker.setPosition([geoStore.coords.longitude, geoStore.coords.latitude])
      })
    }
  })
})

onUnmounted(() => {
  mapObj.destroy()
})
</script>

<template>
  <section class="quick-match">
    <div id="map-container" />
    <q-card class="my-card" fixed bottom-10 left-0 right-0 w-60 mx-auto>
      <q-card-section class="bg-grey-8 text-white">
        <div class="text-h6">
          {{ cardInfo.address }}
          <!-- <span text-sm>附近</span> -->
        </div>
        <div class="text-subtitle2" truncate>
          {{ cardInfo.fullAddress }}
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<style lang='scss' scoped>
#map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
