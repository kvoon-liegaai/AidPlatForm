import { http } from '../http'

export const getProfileById = (id: number) => http.get(`user/${id}`)
