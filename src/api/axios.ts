import Axios from 'axios';
import {HOST} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const APIClient = () => {
  const axios = Axios.create({
    baseURL: HOST,
    timeout: 15000,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  axios.interceptors.request.use(config => {
    config.params = {
      ...config.params,
    };
    return config;
  });

  axios.interceptors.response.use(
    response => response,
    err => {
      console.log(
        '[AXIOS ERROR INTECEPTOR]',
        err.response?.data?.message || err?.message,
      );
      if (err?.response?.data?.code === 401 || err?.response?.status === 401) {
        AsyncStorage.clear();
        return;
      }
      if (err?.response?.data?.code === 502) {
        throw {
          err,
        };
      }
      if (err?.response?.data?.code === 401 || err?.response?.status === 401) {
        //Auto logout action
        AsyncStorage.clear();
      }
      if (err?.response?.data?.code === 500 || err?.response?.status === 500) {
        console.log(err?.response?.data);
        return err?.response?.data;
      }
      throw {
        err,
      };
    },
  );
  return axios;
};
