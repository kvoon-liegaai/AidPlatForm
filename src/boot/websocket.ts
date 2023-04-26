import { boot } from 'quasar/wrappers'
import type { Socket } from 'socket.io-client'
import { notificationSocket } from 'src/service/websocket/notification'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $notificationSocket: Socket
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$notificationSocket = notificationSocket
})
