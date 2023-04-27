import { Notify, date } from 'quasar'
import type { HelpResourceModel } from 'src/service/resource/resource.model'
import { HelpResourceStatus } from 'src/service/resource/resource.model'
import { notificationSocket } from 'src/service/websocket/notification'

export function setHrStatus(hr: HelpResourceModel, status: HelpResourceStatus) {
  switch (status) {
    case HelpResourceStatus.ONGOING: {
      if (Date.now() < Date.parse(date.extractDate(hr.start_date, 'YYYY-MM-DD HH:mm').toDateString())) {
        Notify.create('当前时间不再预定时间范围内')
        return
      }
      break
    }
    case HelpResourceStatus.CANCELED:
      break
    case HelpResourceStatus.DELETE:
      break
    case HelpResourceStatus.FULFILL:
      break
    default:
      break
  }

  notificationSocket.emit('update-hr', {
    helpResourceId: hr.id,
    status,
  })
}

export const timestamp2MS = (timestamp: number) =>
  timestamp
    ? { minutes: Math.floor(timestamp / 60000), seconds: ((timestamp % 60000) / 1000).toFixed(0) }
    : { minutes: 0, seconds: 0 }
