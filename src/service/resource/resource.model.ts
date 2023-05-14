import type { EvaluationModel } from '../evaluation/evaluation.model'
import type { ILocation } from '../map/map.model'
import type { ProfileModel } from '../user/user.model'

// export enum HelpResourceStatus {
//   PENDING,
//   FULFILL,
//   CANCELED,
//   ONGOING,
// }
export enum HelpResourceStatus {
  UNUSED = 0, // 0: 无人使用
  PENDING = 1, // 1: 接受、未开始
  FULFILL = 2, // 2: 接受、完成
  CANCELED = 3, // 3: 接受、取消
  ONGOING = 4, // 4: 接受、进行中
  DELETE = 5, // 5: 删除
}

export const status2Name = {
  // 0 -> 全部
  [HelpResourceStatus.UNUSED]: '空闲',
  [HelpResourceStatus.PENDING]: '未开始',
  [HelpResourceStatus.FULFILL]: '已完成',
  [HelpResourceStatus.CANCELED]: '已取消',
  [HelpResourceStatus.ONGOING]: '进行中',
  [HelpResourceStatus.DELETE]: '已删除',
}

// export const helpResourceStatus: HelpResourceStatus = {
//   UNUSED: 0, // 0: 无人使用
//   PENDING: 1, // 1: 接受、未开始
//   FULFILL: 2, // 2: 接受、完成
//   CANCELED: 3, // 3: 接受、取消
//   ONGOING: 4, // 4: 接受、进行中
//   DELETE: 5, // 5: 删除
// }

export type CreateHelpResourceParams = Pick<
  HelpResourceModel,
  'longitude' |
  'latitude' |
  'name' |
  'subArea' |
  'tag' |
  'start_date' |
  'end_date' |
  'describe'
>

export interface RecordModel {
  id: number
  create_date: Date
  start_date: string
  end_date: string
}

export interface HelpResourceModel extends ILocation {
  id: number
  name: string
  describe: string
  subArea: string
  tag: string
  start_date: string
  end_date: string
  status: HelpResourceStatus
  createTime: string
  user: ProfileModel
  receiver: ProfileModel
  record?: RecordModel
  evaluations: EvaluationModel[]
}
