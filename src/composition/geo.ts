/**
 * @param format
 */
export const useDefaultCoords = <T extends 'array' | 'object'>(
  format: T
): T extends 'object'
  ? { longitude: number; latitude: number }
  : [number, number] => {
  // const longitude = -74.5;
  // const latitude = 40;
  const longitude = 113.922869;
  const latitude = 22.515923;
  // 113.940342, 22.536659

  if (format != 'object')
    return [longitude, latitude] as T extends 'object'
      ? never
      : [number, number];
  if (format === 'object')
    return { longitude, latitude } as T extends 'object'
      ? { longitude: number; latitude: number }
      : never;

  throw new Error(`Unsupported format: ${format}`);
};
