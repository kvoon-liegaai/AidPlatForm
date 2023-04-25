import { http } from '../http'
import type { CreateHelpResourceParams, HelpResourceModel, HelpResourceStatus } from './resource.model'

export enum HelpResourceApi {
  HR = 'help-resource',
  Tag = 'help-resource/tag',
  ProviderAppoint = 'help-resource/appoint/provider',
  ReceiverAppoint = 'help-resource/appoint/receiver',
}

/* create */

export const createHelpResource = (params: CreateHelpResourceParams) => {
  return http.post<HelpResourceModel>(HelpResourceApi.HR, params)
}

/* get */

export const getHelpResource = (id: number) => {
  return http.get<HelpResourceModel>(`${HelpResourceApi.HR}/${id}`)
}

export const getProvidedResources = (userId: number) => {
  return http.get<HelpResourceModel[]>(`${HelpResourceApi.HR}/userId/${userId}`)
}

// tag

export const fetchResourceListWithTag = (tag: string) => {
  return http.get<HelpResourceModel[]>(`${HelpResourceApi.Tag}/${encodeURIComponent(tag)}`)
}

// appoint provider
// all or with status
export const getProviderAppointList = (status?: HelpResourceStatus) => {
  return status
    ? http.get<HelpResourceModel[]>(`${HelpResourceApi.ProviderAppoint}/${status}`)
    : http.get<HelpResourceModel[]>(`${HelpResourceApi.ProviderAppoint}`)
}

// appoint receiver
// all or with status
export const getReceiverAppointList = (status?: HelpResourceStatus) => {
  return status
    ? http.get<HelpResourceModel[]>(`${HelpResourceApi.ReceiverAppoint}/${status}`)
    : http.get<HelpResourceModel[]>(`${HelpResourceApi.ReceiverAppoint}`)
}

/* patch */
// NOTE: 更新状态通过 websocket emit 'hr-update' 更新

/* delete */
export const deleteHelpResource = (id: number) => {
  return http.delete(`${HelpResourceApi.HR}/${id}`)
}
