import axios, { AxiosResponse } from 'axios';

type GeoJsonFeature = {
  center: [number, number];
  place_name: string;
  place_type: string[];
  relevance: number;
};

type ReverseGeocodingResponse = {
  features: GeoJsonFeature[];
};

type ReverseGeocodingOptions = {
  accessToken: string;
  longitude: number;
  latitude: number;
  language?: string;
  types?: string[];
};

const reverseGeocode = async (
  options: ReverseGeocodingOptions
): Promise<GeoJsonFeature[]> => {
  if (!options.language) options.language = 'zh-Hans';
  const { accessToken, longitude, latitude, language, types } = options;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`;

  const params = {
    access_token: accessToken,
    language,
    types: types ? types.join(',') : undefined,
  };

  const response: AxiosResponse<ReverseGeocodingResponse> = await axios.get(
    url,
    { params }
  );

  const features = response.data.features;

  return features;
};

export { reverseGeocode };
