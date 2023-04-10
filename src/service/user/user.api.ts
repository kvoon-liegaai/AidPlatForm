import { http } from '../http'

export interface SelfProfileModel {
  id: number
  username: string
}

export const getSelfProfile = () => http.get<SelfProfileModel>('profile')

export const getProfileById = (id: number) => http.get(`user/${id}`)
