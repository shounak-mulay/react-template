import { generateApiClient } from '@utils/apiUtils';
const repoApi = generateApiClient('github');

export const getRepos = repoName =>
  repoApi.get(`/search/repositories?q=${repoName}`);

export const getIssues = (userName, repoName) =>
  repoApi.get(`/repos/${userName}/${repoName}/issues`);
