<template>
  <section class="quick-match">
    <q-layout view="lHh lpr lFf" container h-screen>
      <q-header>
        <back-bar title="位置选择"></back-bar>
        <!-- {{ geoStore.coords.longitude + " " + geoStore.coords.latitude }} -->
      </q-header>

      <q-page-container>
        <q-page relative>
          <div id="container" absolute top-0 bottom-0 left-0 right-0></div>
          <pin-marker-vue id="pin" location="123" theme-color="primary" :status="LoadStatus.PENDING"
            :on-click="run"></pin-marker-vue>
          <!-- <div class="geo-info-card" fixed bottom-0 bg-white w-screen>
            <div class="geo-info-card__address">位置</div>
            <div class="geo-info-card__fullAddress">位置位置位置位置位置</div>
            <q-btn color="primary">确认</q-btn>
          </div> -->
          <q-card class="my-card" fixed bottom-10 left-0 right-0 w-90 mx-auto>
            <q-card-section class="bg-grey-8 text-white">
              <div class="text-h6">Our Changing Planet</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>

            <q-card-actions vertical align="center">
              <q-btn flat w-full font-bold>确认</q-btn>
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
// import { useGeolocation } from '@vueuse/core'
import { useDefaultCoords } from 'src/composition/geo';
import { useGeoStore } from 'src/stores/geo';
import PinMarkerVue from 'src/components/PinMarker.vue';
import { LoadStatus } from 'src/types/status';

const geoStore = useGeoStore();

let mapObj: AMap.Map;
let pinMarker: AMap.Marker;
let selfMarker: AMap.Marker;

function run() {
  console.log('213')
}

onMounted(() => {
  if (!AMap) {
    Notify.create('地图加载失败')
    return
  }

  nextTick(() => {
    let center: [number, number];

    if (geoStore.error) {
      center = useDefaultCoords('array');
      Notify.create({ message: '未开启地图权限，已为您设置到 app 默认地址' })
    }
    else {
      center = [geoStore.coords.longitude, geoStore.coords.latitude]
    }

    mapObj = new AMap.Map('container', {
      center,
      zoom: 11
    })


    const pinDom = document.getElementById('pin')
    if (pinDom) {
      pinMarker = new AMap.Marker({
        content: pinDom,
        position: mapObj.getCenter(),
        anchor: 'bottom-center'
      })
      pinMarker.addTo(mapObj);
    }

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

    mapObj.on('mapmove', () => {
      const lnglat = mapObj.getCenter();
      pinMarker.setPosition([lnglat.getLng(), lnglat.getLat()]);
    })
  })
})


</script>

<style lang='scss' scoped></style>
