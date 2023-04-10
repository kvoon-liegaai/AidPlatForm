<script setup lang='ts'>
import { Notify } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import { useGeoStore } from 'src/stores/geo'
import PinMarkerVue from 'src/components/PinMarker.vue'
import { LoadStatus } from 'src/types/status'
import { debounceTime, merge, tap } from 'rxjs'
import { fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { GeoService } from 'src/service/geo.service'
import type { IGeo } from 'src/service/map/map.model'

const props = defineProps<{
  source?: {
    longitude: number
    latitude: number
  }
}>()

const emits = defineEmits<{
  (event: 'confirm', geo: IGeo): void
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

function onConfirm() {
  if (pinStatus.value === LoadStatus.LOADING) {
    Notify.create({ message: '请先选好位置', position: 'top' })
    return
  }
  emits('confirm', cardInfo.value)
}

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

    // map essential event ->  observable
    // @ts-expect-error
    const mapComplete$ = fromEvent(mapObj, 'complete')
    // @ts-expect-error
    const mapMove$ = fromEvent(mapObj, 'mapmove')
    // @ts-expect-error
    const mapMoveEnd$ = fromEvent(mapObj, 'moveend')

    useSubscription(
      merge(
        mapComplete$,
        mapMoveEnd$.pipe(debounceTime(1000)),
      )
        .subscribe(() => {
          console.log('获取中心点位置')
          geoService.updateLngLat(mapObj.getCenter())
        }),
    )

    useSubscription(
      mapMove$
        .subscribe(() => pinStatus.value = LoadStatus.LOADING),
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
    <PinMarkerVue id="pin" :location="cardInfo.address" theme-color="primary" :status="pinStatus" />
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

      <!-- <q-card-actions vertical align="center" @click="onConfirm"> -->
      <q-card-actions vertical align="center" @click="onConfirm">
        <q-btn flat w-full font-bold :disable="pinStatus !== LoadStatus.PREPARED">
          确认
        </q-btn>
      </q-card-actions>
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

#pin {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -100%);
}
</style>
