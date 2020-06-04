import { fromJS } from 'immutable';
import produce from 'immer';
import { createActions } from 'reduxsauce';
import _ from 'lodash';

export const {
  Types: issuesContainerTypes,
  Creators: issuesContainerCreators
} = createActions({
  requestGetRepoIssues: ['userName', 'repoName'],
  successGetRepoIssues: ['data'],
  failureGetRepoIssues: ['error']
});

export const initialState = fromJS({});

export const issuesContainerReducer = (state = initialState, action) =>
  produce(state, () => {
    switch (action.type) {
      case issuesContainerTypes.REQUEST_GET_REPO_ISSUES:
        return initialState
          .set('userName', action.userName)
          .set('repoName', action.repoName);
      case issuesContainerTypes.SUCCESS_GET_REPO_ISSUES:
        return state.set('issuesData', action.data);
      case issuesContainerTypes.FAILURE_GET_REPO_ISSUES:
        return state.set(
          'issuesError',
          _.get(action.error, 'message', 'something_went_wrong')
        );
    }
    return state;
  });

export default issuesContainerReducer;
