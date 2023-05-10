import type { UserModel } from '../auth/auth.model'
import { http } from '../http'
import type { ProfileModel, SelfProfileModel } from './user.model'

export const getSelfProfile = () => http.get<SelfProfileModel>('profile')

export const getProfileById = (id: number) => http.get<ProfileModel>(`user/${id}`)

export function updateUserProfile(params: Pick<UserModel, 'email' | 'nickname' | 'describe'>) {
  return http.patch<UserModel>('user', params)
}
