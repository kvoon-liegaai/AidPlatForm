<template>
  <section class="quick-match">
    <q-layout view="lHh lpr lFf" container h-screen>
      <q-header>
        <back-bar title="位置选择"></back-bar>
        <!-- {{ geoStore.coords.longitude + " " + geoStore.coords.latitude }} -->
      </q-header>

      <q-page-container>
        <q-page relative>
          <div id="map-container"></div>
          <pin-marker-vue id="pin" :location="cardInfo.building" theme-color="primary" :status="pinStatus"
            :on-click="run"></pin-marker-vue>
          <q-card class="my-card" fixed bottom-10 left-0 right-0 w-60 mx-auto>
            <q-card-section class="bg-grey-8 text-white">
              <div class="text-h6">{{ cardInfo.building }}
                <!-- <span text-sm>附近</span> -->
              </div>
              <div class="text-subtitle2" truncate>{{ cardInfo.formattedAddress }}</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn flat w-full font-bold :disable="pinStatus != LoadStatus.PREPARED">确认</q-btn>
            </q-card-actions>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </section>
</template>

<script setup lang='ts'>
import BackBar from 'src/components/BackBar.vue';
import { Notify } from 'quasar';
import { useDefaultCoords } from 'src/composition/geo';
import { useGeoStore } from 'src/stores/geo';
import PinMarkerVue from 'src/components/PinMarker.vue';
import { LoadStatus } from 'src/types/status';
import { getReGeo } from './utils';
import { catchError, debounce, debounceTime, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs'
import { fromEvent, useSubscription } from '@vueuse/rxjs'

const geoStore = useGeoStore();

// let mapObj: mapboxgl.Map;
// let pinMarker: mapboxgl.Marker;
let mapObj: AMap.Map;
let pinMarker: AMap.Marker;
let pinStatus = ref(LoadStatus.LOADING);
let selfMarker: AMap.Marker;

const cardInfo = reactive({
  building: '',
  formattedAddress: ''
})

function run() {
  console.log('213')
}

onMounted(() => {
  let center: [number, number];

  nextTick(() => {
    if (!AMap) {
      Notify.create('地图加载失败')
      return
    }

    // set center
    if (!geoStore.error && geoStore.coords.latitude != Infinity && geoStore.coords.longitude != Infinity) {
      center = [geoStore.coords.longitude, geoStore.coords.latitude];
    }
    else {
      center = useDefaultCoords('array');
      Notify.create({ message: geoStore.error?.code + ':未获取到您的位置，已为您设置到 app 默认地址' })
      console.log('geoStore.error', geoStore.error)
    }
    console.log('center', center)

    // init map
    mapObj = new AMap.Map('map-container', {
      center,
      zoom: 16,
    })

    const RegeoCenter2UpdateCardInfo = (): Observable<any> =>
      getReGeo(mapObj.getCenter())
        .pipe(
          tap((regeocode) => {
            console.log('regeocode', regeocode)
            if (regeocode.aois && regeocode.aois.length != 0) {
              cardInfo.building = regeocode.aois[0].name;
              cardInfo.formattedAddress = regeocode.formattedAddress;
              pinStatus.value = LoadStatus.PREPARED;
            }
            else {
              cardInfo.building = '当前位置';
              cardInfo.formattedAddress = '';
              pinStatus.value = LoadStatus.LOADING;
            }
          })
        )

    // map event
    // @ts-ignore
    const mapComplete$ = fromEvent(mapObj, 'complete')
    useSubscription(
      mapComplete$
        .pipe(switchMap(RegeoCenter2UpdateCardInfo))
        .subscribe()
    )
    // @ts-ignore
    const mapMove$ = fromEvent(mapObj, 'mapmove').pipe(tap(() => pinStatus.value = LoadStatus.LOADING))
    // @ts-ignore
    const mapMoveEndDebounced$ = fromEvent(mapObj, 'moveend')

    // pin marker
    const pinDom = document.getElementById('pin')
    if (pinDom) {
      // pinMarker = new AMap.Marker({
      //   content: pinDom,
      //   position: mapObj.getCenter(),
      //   anchor: 'bottom-center'
      // })
      // pinMarker.addTo(mapObj);

      useSubscription(
        mapMoveEndDebounced$
          .pipe(
            debounceTime(1000),
            tap(() => console.log('获取中心点位置')),
            switchMap(RegeoCenter2UpdateCardInfo),
          )
          .subscribe(() => {
            console.log('123')
          })
      )
      useSubscription(
        mapMove$.subscribe()
      )
    }

    // self marker
    if (!geoStore.error) {
      selfMarker = new AMap.Marker({
        // content: ,
        position: center
      });
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
