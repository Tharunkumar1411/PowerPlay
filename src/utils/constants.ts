import Config from 'react-native-config';

export const HOST = Config.HOST;

export const H0ME_API = {
  SEARCH_REPO: ({page = 1, limit = 10}: {page?: number; limit?: number}) =>
    `users/octocat/repos?per_page=${limit}&page=${page}`,
};
