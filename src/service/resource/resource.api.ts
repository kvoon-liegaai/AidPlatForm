import { http } from '../http'
import type { CreateHelpResourceParams, HelpResourceModel } from './resource.model'

export enum HelpResourceApi {
  HR = 'help-resource',
}

export const createHelpResource = (params: CreateHelpResourceParams) => {
  return http.post<HelpResourceModel>(HelpResourceApi.HR, params)
}

export const getProvidedResources = (userId: number) => {
  return http.get<HelpResourceModel[]>(`${HelpResourceApi.HR}/${userId}`)
}

export const deleteHelpResource = (id: number) => {
  return http.delete(`${HelpResourceApi.HR}/${id}`)
}

export const fetchResourceListWithTag = (tag: string) => {
  return http.get<HelpResourceModel[]>(`${HelpResourceApi.HR}/tag/${encodeURIComponent(tag)}`)
}
