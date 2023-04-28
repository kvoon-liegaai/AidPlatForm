import { AddressbarColor, Notify } from 'quasar'
import { boot } from 'quasar/wrappers'
import { useGeoStore } from 'src/stores/geo'
import { useProfileStore } from 'src/stores/profile.store'
import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

useGeoStore()
useProfileStore()

export default boot(({ app }) => {
  app.use(JsonViewer)

  Notify.setDefaults({
    position: 'center',
    timeout: 500,
  })

  AddressbarColor.set('#00bdd6')
})
