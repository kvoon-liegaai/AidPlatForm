import { useDefaultCoords } from 'src/composition/geo'
import type { IGeo } from 'src/service/map/map.model'
import type { CreateHelpResourceParams } from 'src/service/resource/resource.model'

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

const defaultProvideService: CreateHelpResourceParams = {
  name: '',
  userId: 0,
  subscribe: '',
  subArea: '',
  startDate: '2019-02-22 21:02',
  endDate: '2019-02-22 21:02',
  lnglat: useDefaultCoords('object'),
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
