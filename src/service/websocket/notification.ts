import { useSubscription } from '@vueuse/rxjs'
import { Dialog, Notify } from 'quasar'
import { zip } from 'rxjs'
import { io } from 'socket.io-client'
import { helpResourceApplyMsgState } from 'src/common/ws'
import { useProfileStore } from 'src/stores/profile.store'
import { getHelpResource } from '../resource/resource.api'
import type { HelpResourceModel } from '../resource/resource.model'
import { getProfileById } from '../user/user.api'
import type { ProfileModel } from '../user/user.model'

const profileStore = useProfileStore()

const notificationSocket = io(
  import.meta.env.VITE_NOTIFICATION_WEB_SOCKET,
  {
    query: {
      userId: profileStore.id,
    },
  })

// client-side
notificationSocket.on('connect', () => {
  console.log('notification connect', notificationSocket.id) // x8WIv7-mJelg7on_ALbx
})

notificationSocket.on('disconnect', () => {
  console.log('notification disconnect', notificationSocket.id) // undefined
})

// watch ws event
notificationSocket.on('apply-hr', ({ userId, helpResourceId }: { userId: number; helpResourceId: number }) => {
  console.log('userId', userId)
  const applyHrInfo$ = zip(
    getProfileById(userId),
    getHelpResource(helpResourceId),
  )
  const onNotifyIgnore = () => { /* ... */ }
  const onNotifyConfirm = ({ profile, helpResource }: { profile: ProfileModel; helpResource: HelpResourceModel }) => {
    Dialog.create({
      title: '互助请求',
      message: ` 昵称：${profile.nickname} 互助资源：${helpResource.name} `,
      ok: '同意帮助',
      cancel: '拒绝',
    })
      .onOk(() => {
        notificationSocket.emit('handle-apply', {
          helpResourceId,
          userId,
          status: helpResourceApplyMsgState.FULFILLED,
        })
      })
      .onCancel(() => {
        notificationSocket.emit('handle-apply', {
          helpResourceId,
          userId,
          status: helpResourceApplyMsgState.REJECTED,
        })
      })
  }

  useSubscription(
    applyHrInfo$.subscribe(([profile, helpResource]) => {
      Notify.create({
        message: '您有新的互助请求',
        color: 'info',
        icon: 'outgoing_mail',
        // TODO: setting avatar
        // avatar: profile.avatar ? profile.avatar : 'https://cdn.quasar.dev/img/avatar2.jpg',
        multiLine: true,
        position: 'top',
        actions: [
          { label: '忽略', color: 'yellow', handler: onNotifyIgnore },
          { label: '查看', color: 'white', handler: onNotifyConfirm.bind(null, { profile, helpResource }) },
        ],
        timeout: 0,
      })
    }),
  )
})

export { notificationSocket }
