import { createSelector } from 'reselect';
import _ from 'lodash';
import { initialState } from './reducer';

const selectIssuesContainerDomain = state =>
  (state.issuesContainer || initialState).toJS();

export const selectIssuesContainer = () =>
  createSelector(
    selectIssuesContainerDomain,
    substate => substate
  );

export const selectIssuesData = () =>
  createSelector(
    selectIssuesContainerDomain,
    substate => _.get(substate, 'issuesData', [])
  );

export const selectIssuesError = () =>
  createSelector(
    selectIssuesContainerDomain,
    substate => _.get(substate, 'issuesError', null)
  );

export const selectRepoName = () =>
  createSelector(
    selectIssuesContainerDomain,
    substate => _.get(substate, 'repoName', null)
  );

export const selectUserName = () =>
  createSelector(
    selectIssuesContainerDomain,
    substate => _.get(substate, 'userName', null)
  );

export default selectIssuesContainer;
