import { useDefaultCoords } from 'src/composition/geo'

interface IGeo {
  address: string
  fullAddress: string
  lnglat: {
    longitude: number
    latitude: number
  }
  regeocode: any
}

interface IQuickMatchSheet {
  subareaName: string
  date: {
    from: string
    to: string
  }
  geo: IGeo
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

export type { IGeo, IQuickMatchSheet }

export { defaultQuickMatchSheet }
