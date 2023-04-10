import type { Location } from '../map/map.model'

export interface CreateHelpResourceParams extends Location {
  userId: number
  name: string
  subscribe: string
  subArea: string
  startDate: string
  endDate: string
}
