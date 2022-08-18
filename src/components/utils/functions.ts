import { Endpoint } from '../types/enums';

const generateQueryString = (queryParam: Record<string, string>): string => `?${Object.keys(queryParam)
  .map((key: string) => `${key}=${queryParam[key]}`)
  .join('&')}`;

export const makeUrl = (
  base: string,
  endpoint: Endpoint,
  queryParam?: Record<string, string>,
): URL => {
  const paramString = queryParam ? generateQueryString(queryParam) : '';
  return new URL(`${endpoint}${paramString}`, base);
};
