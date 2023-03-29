export interface ISubArea {
  name: string
  subtitle: string
  cards: {
    icon: {
      name: string
      color: string
      background: string
    }
    title: string
    desc: string
  }[]
}

export const subAreas: ISubArea[] = [
  {
    name: '物质帮助',
    subtitle: '为有需要的人提供各种实质性的帮助',
    cards: [
      {
        icon: {
          name: 'lucide:package',
          color: '#ED7D2DFF',
          background: '#F9D8C0FF',
        },
        title: '物资分享',
        desc: '提供有需要的人们各种物资的分享，如食品、衣物、医药用品等。',
      },
      {
        icon: {
          name: 'ph:truck-fill',
          color: '#1091F4FF',
          background: '#B8DEFCFF',
        },
        title: '代领快递',
        desc: '为身体不便的人们代为领取快递和包裹。',
      },
    ],
  },
  {
    name: '生活帮助',
    subtitle: '在生活中提供各种类型的帮助',
    cards: [
      {
        icon: {
          name: 'ph:pedestrian-fill',
          color: '#17A948FF',
          background: '#B8F5CDFF',
        },
        title: '照看家属',
        desc: '提供照顾有需要的家人或亲人的帮助，如老年人、病人、残疾人等。',
      },
      {
        icon: {
          name: 'ph:chats-circle-duotone',
          color: '#1091F4FF',
          background: '#B8DEFCFF',
        },
        title: '心理支持',
        desc: '提供各种类型的心理支持，如倾听、陪伴、鼓励等。',
      },
      {
        icon: {
          name: 'ph:barbell-duotone',
          color: '#323842FF',
          background: '#DEE1E6FF',
        },
        title: '健身陪练',
        desc: '提供陪伴和指导进行健身锻炼的帮助，如一起跑步、健身房等。',
      },
      {
        icon: {
          name: 'mdi:house-city',
          color: '#E05858FF',
          background: '#F5CBCBFF',
        },
        title: '帮忙搬家',
        desc: '提供帮助搬运家具和物品的服务，如搬家、打扫等。',
      },
    ],
  },
  {
    name: '紧急帮助',
    subtitle: '在紧急情况下提供各种援助',
    cards: [
      {
        icon: {
          name: 'ph:bandaids-fill',
          color: '#00BDD6FF',
          background: '#EBFDFFFF',
        },
        title: '药品共享',
        desc: '在紧急情况下提供必需的药品共享。',
      },
      {
        icon: {
          name: 'ph:currency-circle-dollar-fill',
          color: '#4069E5FF',
          background: '#F1F4FDFF',
        },
        title: '经济援助',
        desc: '提供经济上的援助，如为需要的人提供食品、医疗费用等。',
      },
    ],
  },
]

export const subAreasName = subAreas.map(subArea => subArea.name)
