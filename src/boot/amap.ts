import { boot } from 'quasar/wrappers';
import '@amap/amap-jsapi-types';
import AMapLoader from '@amap/amap-jsapi-loader';

try {
  window.AMap = await AMapLoader.load({
    key: '3fe65f0c7c0efd5ce211a78beb59ac2f', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  });
} catch (error) {
  console.error('加载高度地图 js api 失败', error);
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
});
