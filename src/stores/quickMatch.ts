import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { date } from 'quasar'
import { useDefaultCoords } from 'src/composition/geo'
import { quickMatch } from 'src/service/resource/resource.api'
import type { HelpResourceModel } from 'src/service/resource/resource.model'

export const useQuickMatchStore = defineStore('quickMatch', {
  state: (): {
    result: HelpResourceModel[]
  } => ({
    result: [],
  }),

  actions: {
    refresh() {
      const form = useLocalStorage('quickMatchForm', {
        subArea: '',
        start_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
        end_date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
        ...useDefaultCoords('object'),
        radius: 150,
      })
      quickMatch(form.value)
        .subscribe((hrs) => {
          console.log('hrs', hrs)
          const start_date = date.extractDate(form.value.start_date, 'YYYY-MM-DD HH:mm')
          const end_date = date.extractDate(form.value.end_date, 'YYYY-MM-DD HH:mm')
          console.log('start_date', start_date)
          console.log('end_date', end_date)
          this.result = hrs.filter((hr) => {
            const hr_start_date = date.extractDate(hr.start_date, 'YYYY-MM-DD HH:mm')
            const hr_end_date = date.extractDate(hr.end_date, 'YYYY-MM-DD HH:mm')
            console.log('hr_start_date', hr_start_date)
            console.log('hr_end_date', hr_end_date)
            const isDateFit = date.isBetweenDates(
              hr_start_date,
              start_date,
              end_date,
            )
              && date.isBetweenDates(
                hr_end_date,
                start_date,
                end_date,
              )
            const isDistanceFit = AMap.GeometryUtil.distance(
              [hr.longitude, hr.latitude],
              [form.value.longitude, form.value.latitude],
            ) < form.value.radius

            return isDateFit && isDistanceFit
          })
          console.log('this.result', this.result)
          // date.isBetweenDates(
          //   form.value.start_date
          // )
        })
    },
    // increment() {
    //   this.counter++
    // },
  },
})
