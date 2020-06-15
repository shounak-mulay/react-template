import React, { useState, memo, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Card, Skeleton, Tag } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useInjectSaga } from 'utils/injectSaga';
import { injectIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { issuesContainerCreators } from './reducer';
import saga from './saga';
import selectIssuesContainer, {
  selectIssuesData,
  selectIssuesError,
  selectRepoName,
  selectUserName,
  selectLoaded
} from './selectors';
import * as isEmpty from 'lodash/isEmpty';
import For from '@app/components/For/index';

const Container = styled.div`
  && {
    display: flex;
    flex-direction: column;
    max-width: ${props => props.maxWidth}px;
    width: 100%;
    margin: 0 auto;
    padding: ${props => props.padding}px;
  }
`;

const CustomTag = styled(Tag)`
  && {
    margin: 5px;
    color: black;
  }
`;

const CustomCard = styled(Card)`
  && {
    margin: 20px 0;
    max-width: ${props => props.maxWidth};
    color: ${props => props.color};
    ${props => props.color && `color: ${props.color}`};
  }
`;

export function IssuesContainer({
  dispatchRepoIssues,
  dispatchClearRepoIssues,
  repoName,
  userName,
  issuesData = [],
  loaded,
  issuesError = null,
  intl,
  maxWidth,
  padding
}) {
  useInjectSaga({ key: 'issuesContainer', saga });
  const { owner, repo } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debouncedHandleOnLoad(owner, repo);
    return dispatchClearRepoIssues;
  }, []);

  useEffect(() => {
    if (loading && loaded) {
      setLoading(false);
    }
  }, [issuesData, issuesError]);

  const handleOnLoad = (owner, repo) => {
    dispatchRepoIssues(owner, repo);
    setLoading(true);
  };

  const debouncedHandleOnLoad = debounce(handleOnLoad, 200);

  const renderLabels = labels => {
    if (labels?.length) {
      return (
        <div style={{ display: 'inline' }}>
          {labels.map((label, index) => {
            return (
              <CustomTag key={index} color={`#${label.color}`}>
                <div>{label.name}</div>
              </CustomTag>
            );
          })}
        </div>
      );
    } else {
      return 'None';
    }
  };

  const renderErrorState = () => {
    return (
      loaded &&
      issuesError && (
        <CustomCard
          color="red"
          title={`No Issues Found For ${repoName} By ${userName}`}
        >
          <div>Error Message: {`"${issuesError || 'No Issues Found'}"`}</div>
        </CustomCard>
      )
    );
  };

  const renderIssueListItem = (data, index) => {
    return (
      <a key={index} href={`${data.htmlUrl}`}>
        <CustomCard title={data.title} key={index}>
          <div>
            {intl.formatMessage({ id: 'issue_number' })}: {data.number}
          </div>
          <div>
            {intl.formatMessage({ id: 'state' })}: {data.state}
          </div>
          <div>
            {intl.formatMessage({ id: 'labels' })}: {renderLabels(data.labels)}
          </div>
        </CustomCard>
      </a>
    );
  };

  const renderIssuesList = () => {
    if (!isEmpty(issuesData) || loading) {
      return (
        !issuesError && (
          <CustomCard>
            <Skeleton loading={loading} active>
              <For
                isRow={false}
                of={issuesData}
                renderItem={renderIssueListItem}
              />
            </Skeleton>
          </CustomCard>
        )
      );
    } else if (loaded && !issuesError) {
      return (
        <CustomCard>
          <div>
            No Issues Present For {repoName} By {userName}
          </div>
        </CustomCard>
      );
    }
  };

  return (
    <Container maxWidth={maxWidth} padding={padding}>
      <CustomCard title={`Issues for Repository: ${repo}`}>
        <div>
          By <h3 style={{ display: 'inline' }}>{owner}</h3>
        </div>
      </CustomCard>
      {renderIssuesList()}
      {renderErrorState()}
    </Container>
  );
}

IssuesContainer.propTypes = {
  dispatchRepoIssues: PropTypes.func,
  dispatchClearRepoIssues: PropTypes.func,
  repoName: PropTypes.string,
  userName: PropTypes.string,
  issuesData: PropTypes.array,
  loaded: PropTypes.bool,
  issuesError: PropTypes.string,
  maxWidth: PropTypes.number,
  padding: PropTypes.number,
  intl: PropTypes.object
};

IssuesContainer.defaultProps = {
  maxWidth: 500,
  padding: 20
};

const mapStateToProps = createStructuredSelector({
  issuesContainer: selectIssuesContainer(),
  issuesData: selectIssuesData(),
  loaded: selectLoaded(),
  issuesError: selectIssuesError(),
  repoName: selectRepoName(),
  userName: selectUserName()
});

function matchDispatchToProps(dispatch) {
  const { requestGetRepoIssues, clearRepoIssues } = issuesContainerCreators;
  return {
    dispatchRepoIssues: (userName, repoName) => {
      return dispatch(requestGetRepoIssues(userName, repoName));
    },
    dispatchClearRepoIssues: () => {
      return dispatch(clearRepoIssues());
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  matchDispatchToProps
);

export default compose(
  injectIntl,
  withConnect,
  memo
)(IssuesContainer);
