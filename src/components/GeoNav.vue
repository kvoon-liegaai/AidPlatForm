<script setup lang='ts'>
import { Notify } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import { useGeoStore } from 'src/stores/geo'
import { merge, tap } from 'rxjs'
import { fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { GeoService } from 'src/service/geo.service'
import type { IGeo } from 'src/service/map/map.model'
import type { MapNavState } from 'src/pages/AppointmentPage/types'

const props = defineProps<{
  state: MapNavState
  starter?: boolean
}>()

const emits = defineEmits<{
  (event: 'onStart'): void
}>()

const geoStore = useGeoStore() // self geo location

const geoService = new GeoService()

let mapObj: AMap.Map
// let pinMarker: AMap.Marker;
let selfMarker: AMap.Marker

const radius = Number(import.meta.env.VITE_MAP_RADIUS)
const distance = ref(9999)
const canStart = computed(() => distance.value < radius)

const cardInfo = ref<IGeo>({
  address: '',
  fullAddress: '',
  lnglat: useDefaultCoords('object'),
  regeocode: {},
})

function start() {
  console.log('click start btn')
  if (canStart.value)
    emits('onStart')
  else
    Notify.create('请先到达指定位置')
}

useSubscription(
  geoService.geo
    .pipe(
      tap((geo) => {
        console.log('geo', geo)
        if (geo.address === '当前位置')
          Notify.create({ message: '无效的地理位置', position: 'top' })
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

    // center -> source
    center = [props.state.source.longitude, props.state.source.latitude]
    console.log('center', center)

    // init map
    mapObj = new AMap.Map('map-container', {
      center,
      zoom: 16,
    })

    const targetMarker = new AMap.Marker({
      position: new AMap.LngLat(...center),
      title: cardInfo.value.address,
      icon: new AMap.Icon({
        image: 'src/assets/marker/self-location.svg',
      }),
      anchor: 'center',
    })
      .addTo(mapObj)

    const circle = new AMap.Circle({
      center, // 圆心
      radius, // 半径
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
      )
        .subscribe(() => {
          console.log('获取中心点位置')
          geoService.updateLngLat(mapObj.getCenter())
        }),
    )

    // self marker
    if (!geoStore.error) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!')
      selfMarker = new AMap.Marker({ position: center })
      selfMarker.addTo(mapObj)
      watchEffect(() => {
        selfMarker.setPosition([geoStore.coords.longitude, geoStore.coords.latitude])
        // check location
        distance.value = AMap.GeometryUtil.distance(
          [geoStore.coords.longitude, geoStore.coords.latitude],
          [props.state.source.longitude, props.state.source.latitude],
        )
      })
    }
    else {
      Notify.create({ type: 'danger', message: '未获取到您的位置' })
    }
  })
})

onUnmounted(() => {
  mapObj.destroy()
})
</script>

<template>
  <section>
    <div id="map-container" />
    <div class="distance-tip" absolute left-0 right-0 top-10 text-center mx-10 bg="coolgray-600" color-white text-xl
      leading-loose rounded-2>
      距离目的地
      <span font-bold> {{ ` ${distance.toFixed(1)} ` }}</span>
      米
    </div>
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
      <q-card-actions v-if="props.starter" vertical align="center">
        <q-btn flat w-full :label="canStart ? '开始' : '未到达指定位置'" @click="start" />
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
</style>
