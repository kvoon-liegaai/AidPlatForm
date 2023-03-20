<template>
  <section class="quick-match">
    <div id="map-container"></div>
    <pin-marker-vue id="pin" :location="cardInfo.address" theme-color="primary" :status="pinStatus"></pin-marker-vue>
    <q-card class="my-card" fixed bottom-10 left-0 right-0 w-60 mx-auto>
      <q-card-section class="bg-grey-8 text-white">
        <div class="text-h6">{{ cardInfo.address }}
          <!-- <span text-sm>附近</span> -->
        </div>
        <div class="text-subtitle2" truncate>{{ cardInfo.fullAddress }}</div>
      </q-card-section>

      <!-- <q-card-actions vertical align="center" @click="onConfirm"> -->
      <q-card-actions vertical align="center" @click="onConfirm">
        <q-btn flat w-full font-bold :disable="pinStatus != LoadStatus.PREPARED">确认</q-btn>
      </q-card-actions>
    </q-card>
  </section>
</template>

<script setup lang='ts'>
import { Notify } from 'quasar';
import { useDefaultCoords } from 'src/composition/geo';
import { useGeoStore } from 'src/stores/geo';
import PinMarkerVue from 'src/components/PinMarker.vue';
import { LoadStatus } from 'src/types/status';
import { debounceTime, merge, switchMap, tap } from 'rxjs'
import { fromEvent, toObserver, useSubscription } from '@vueuse/rxjs'
import { IGeo } from 'src/types';
import { regeo2IGeo } from 'src/utils/map';

const props = defineProps<{
  source?: {
    longitude: number;
    latitude: number;
  }
}>()

const emits = defineEmits<{
  (event: 'confirm', geo: IGeo): void
}>()

const geoStore = useGeoStore(); // self geo location

let mapObj: AMap.Map;
// let pinMarker: AMap.Marker;
let pinStatus = ref(LoadStatus.LOADING);
let selfMarker: AMap.Marker;

const cardInfo = ref<IGeo>({
  address: '',
  fullAddress: '',
  lnglat: useDefaultCoords('object'),
  regeocode: {}
})

function onConfirm() {
  if (pinStatus.value === LoadStatus.LOADING) {
    Notify.create({ message: '请先选好位置', position: 'top' })
    return;
  }
  emits('confirm', cardInfo.value)
}

onMounted(() => {
  let center: [number, number];

  nextTick(() => {
    if (!AMap) {
      Notify.create('地图加载失败')
      return
    }

    // center
    if (props.source) {
      // center from source exist
      center = [props.source.longitude, props.source.latitude];
    }
    else {
      if (!geoStore.error && geoStore.coords.latitude != Infinity && geoStore.coords.longitude != Infinity) {
        // center from self geolocation
        center = [geoStore.coords.longitude, geoStore.coords.latitude];
      }
      else {
        // center from default geolocation
        center = useDefaultCoords('array');
        Notify.create({ message: geoStore.error?.code + ':未获取到您的位置，已为您设置到 app 默认地址' })
        console.log('geoStore.error', geoStore.error)
      }
    }
    console.log('center', center)

    // init map
    mapObj = new AMap.Map('map-container', {
      center,
      zoom: 16,
    })

    // map essential event ->  observable
    // @ts-ignore
    const mapComplete$ = fromEvent(mapObj, 'complete')
    // @ts-ignore
    const mapMove$ = fromEvent(mapObj, 'mapmove')
    // @ts-ignore
    const mapMoveEnd$ = fromEvent(mapObj, 'moveend')

    // card info observable
    // part 1: map complete -> card info
    const geoFromMapComplete$ = mapComplete$
      .pipe(
        switchMap(() => regeo2IGeo(mapObj.getCenter())),
        tap((info) => console.log('获取中心点位置', info)),
      )
    // part 2: debounce(map move end) -> card info
    const geoFromMapMoveEnd_debounced$ = mapMoveEnd$
      .pipe(
        debounceTime(1000),
        switchMap(() => regeo2IGeo(mapObj.getCenter())),
        tap((info) => console.log('获取中心点位置', info)),
      )
    // merge
    const geo$ = merge(geoFromMapComplete$, geoFromMapMoveEnd_debounced$)

    useSubscription(
      geo$
        .pipe(
          tap((geo) => {
            if (geo.address === '当前位置')
              Notify.create({ message: '无效的地理位置', position: 'top' })
            else
              pinStatus.value = LoadStatus.PREPARED;
          }),
        )
        .subscribe(
          toObserver(cardInfo),
        )
    )

    useSubscription(
      mapMove$
        .pipe(tap(() => pinStatus.value = LoadStatus.LOADING))
        .subscribe()
    )

    // self marker
    if (!geoStore.error) {
      selfMarker = new AMap.Marker({ position: center });
      selfMarker.addTo(mapObj);
      watchEffect(() => {
        selfMarker.setPosition([geoStore.coords.longitude, geoStore.coords.latitude])
      })
    }
  })
})

onUnmounted(() => {
  mapObj.destroy();
})
</script>

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
