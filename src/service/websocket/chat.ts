import { io } from 'socket.io-client'
import { useProfileStore } from 'src/stores/profile.store'

const profileStore = useProfileStore()

const chatSocket = io(
  import.meta.env.VITE_CHAT_WEB_SOCKET,
  {
    query: {
      userId: profileStore.id,
    },
  },
)

chatSocket.on('connect', () => {
  console.log('chat connect', chatSocket.id)
})

chatSocket.on('disconnect', () => {
  console.log('chat disconnect', chatSocket.id) // undefined
})

export { chatSocket }
