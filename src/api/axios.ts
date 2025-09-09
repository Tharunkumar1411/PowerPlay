import Axios from 'axios';
import {HOST} from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultOptions = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json',
    },
  };
};

export const APIClient = () => {
  const axios = Axios.create({
    baseURL: HOST,
    ...defaultOptions(),
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
