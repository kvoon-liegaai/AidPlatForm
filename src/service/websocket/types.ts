export interface CreateMessageDto {
  userId: number
  targetUserId?: number
  chatId?: number
  content: string
  messageType: 'text'
}

export interface MessageModel {
  id: number
  userId: number
  content: number
  createTime: number
  messageType: 'text'
}

export interface HrApplyModel {
  createAt: Date
  helpResourceId: number
  id: number
  providerId: number
  status: number
  updateAt: number
  userId: number
}
