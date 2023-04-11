export interface SelfProfileModel {
  id: number
  username: string
}

export interface ProfileModel {
  id: number
  username: string
  email: string
  nickname: string
  roles: string
  createTime: string
  updateTime: string
  avatar: string
  describe: string
}

export const DEFAULT_PROFILE: ProfileModel = {
  id: 0,
  username: '',
  email: '',
  nickname: '',
  roles: '',
  createTime: '',
  updateTime: '',
  avatar: '',
  describe: '',
}
