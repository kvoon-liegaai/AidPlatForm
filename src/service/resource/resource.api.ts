import { http } from '../http'
import type { CreateHelpResourceParams } from './resource.model'

export enum HelpResourceApi {
  createResource = 'help-resource',
}

export const createHelpResource = (params: CreateHelpResourceParams) => {
  return http.post(HelpResourceApi.createResource, params)
}
