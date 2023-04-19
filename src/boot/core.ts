import { boot } from 'quasar/wrappers'
import { useGeoStore } from 'src/stores/geo'
import { useProfileStore } from 'src/stores/profile.store'
import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

useGeoStore()
useProfileStore()

export default boot(({ app }) => {
  app.use(JsonViewer)
})
