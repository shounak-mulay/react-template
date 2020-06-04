import { put, call, takeLatest } from 'redux-saga/effects';
import { getIssues } from '@services/repoApi';
import { issuesContainerTypes, issuesContainerCreators } from './reducer';

const { REQUEST_GET_REPO_ISSUES } = issuesContainerTypes;
const { successGetRepoIssues, failureGetRepoIssues } = issuesContainerCreators;

export function* getRepoIssues(action) {
  const response = yield call(getIssues, action.userName, action.repoName);
  const { data, ok } = response;
  if (ok) {
    yield put(successGetRepoIssues(data));
  } else {
    yield put(failureGetRepoIssues(data));
  }
}

export default function* issuesContainerSage() {
  yield takeLatest(REQUEST_GET_REPO_ISSUES, getRepoIssues);
}
