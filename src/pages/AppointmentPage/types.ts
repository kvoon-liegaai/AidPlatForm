import type { ILocation } from 'src/service/map/map.model'
import type { HelpResourceModel } from 'src/service/resource/resource.model'

export interface MapNavState {
  isShowMapNav: boolean
  source: ILocation
  curHr: HelpResourceModel | null
}
