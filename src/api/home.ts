import {H0ME_API} from '../utils/constants';
import {APIClient} from './axios';

export const getSeachRepo = async (query: string) => {
  const response = await APIClient().get(H0ME_API.SEARCH_REPO(query));
  return response.data.items;
};
