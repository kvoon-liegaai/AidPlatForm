import { boot } from 'quasar/wrappers'
import type { Socket } from 'socket.io-client'
import { chatSocket } from 'src/service/websocket/chat'
import { notificationSocket } from 'src/service/websocket/notification'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $notificationSocket: Socket
    $chatSocket: Socket
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$notificationSocket = notificationSocket
  app.config.globalProperties.$chatSocket = chatSocket
  console.log('notificationSocket', notificationSocket)
  console.log('chatSocket', chatSocket)
})
