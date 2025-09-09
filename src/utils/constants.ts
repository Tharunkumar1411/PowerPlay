import Config from 'react-native-config';

export const HOST = Config.HOST;
console.log('H0ME_API', HOST);

export const H0ME_API = {
  SEARCH_REPO: (query?: string) => `${HOST}/search/repositories?q=${query}`,
};
