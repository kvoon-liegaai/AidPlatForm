import { date } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import type { ExAddress } from 'src/service/map/map.model'
import type { CreateHelpResourceParams, HelpResourceModel } from 'src/service/resource/resource.model'

const defaultProvideService: CreateHelpResourceParams = {
  name: '',
  describe: '',
  subArea: '',
  tag: '',
  // start_date: '2019-02-22 21:02',
  // end_date: '2019-02-22 21:02',
  start_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  end_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  ...useDefaultCoords('object'),
}

const defaultQuickMatchSheet = {
  subareaName: '',
  start_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  end_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
  ...useDefaultCoords('object'),
}

interface TagCardModel extends HelpResourceModel, ExAddress {
  expanded: boolean
}

export {
  defaultQuickMatchSheet,
  defaultProvideService,
}

export type {
  TagCardModel,
}
