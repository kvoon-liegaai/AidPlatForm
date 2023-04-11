import { useDefaultCoords } from 'src/composition/geo'
import type { IGeo } from 'src/service/map/map.model'
import type { CreateHelpResourceParams } from 'src/service/resource/resource.model'
import { HelpResourceStatus } from 'src/service/resource/resource.model'
import { useProfileStore } from 'src/stores/profile.store'

type IQuickMatchSheet = Pick<
  ProvideServiceParams,
  'subareaName' |
  'date' |
  'geo'
>

interface ProvideServiceParams {
  name: string
  subscribe: string

  subareaName: string
  date: {
    from: string
    to: string
  }
  geo: IGeo
}

const profileStore = useProfileStore()

const defaultProvideService: CreateHelpResourceParams = {
  name: '',
  userId: profileStore.getId() | 0,
  describe: '',
  subArea: '',
  startDate: '2019-02-22 21:02',
  endDate: '2019-02-22 21:02',
  status: HelpResourceStatus.PENDING,
  ...useDefaultCoords('object'),
}

const defaultQuickMatchSheet = {
  subareaName: '',
  date: {
    from: '2019-02-22 21:02',
    to: '2019-02-22 21:02',
  },
  geo: {
    address: '',
    fullAddress: '',
    lnglat: useDefaultCoords('object'),
    regeocode: {},
  },
}

export type {
  IQuickMatchSheet,
  ProvideServiceParams,
}

export {
  defaultQuickMatchSheet,
  defaultProvideService,
}
