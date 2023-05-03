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
