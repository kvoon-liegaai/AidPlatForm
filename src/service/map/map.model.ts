export interface ILocation {
  longitude: number
  latitude: number
}

export interface BusinessArea {
  name: string
  id: string
  location: [number, number]
}

export interface AddressComponent {
  citycode: string
  adcode: string
  businessAreas: BusinessArea[]
  neighborhoodType: string
  neighborhood: string
  building: string
  buildingType: string
  street: string
  streetNumber: string
  province: string
  city: string
  district: string
  towncode: string
  township: string
}

export interface Road {
  id: string
  name: string
  distance: number
  direction: string
  location: [number, number]
}

export interface Cross {
  distance: number
  direction: string
  first_id: string
  first_name: string
  second_id: string
  second_name: string
  location: [number, number]
}

export interface Poi {
  id: string
  name: string
  type: string
  address: string
  distance: number
  tel: string
  location: [number, number]
  direction: string
  businessArea: string
}

export interface Regeocode {
  addressComponent: AddressComponent
  formattedAddress: string
  roads: Road[]
  crosses: Cross[]
  pois: Poi[]
}

export interface ExAddress {
  address: string
  fullAddress: string
}

export interface IGeo extends ExAddress {
  lnglat: ILocation
  regeocode: Regeocode | object
}
