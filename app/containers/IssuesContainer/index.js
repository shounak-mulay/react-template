import React, { useState, memo, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Card, Skeleton, Tag } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { useParams } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { useInjectSaga } from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { issuesContainerCreators } from './reducer';
import saga from './saga';
import selectIssuesContainer, {
  selectIssuesData,
  selectIssuesError,
  selectRepoName,
  selectUserName
} from './selectors';

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
  issuesData = [],
  issuesError = null,
  maxWidth,
  padding
}) {
  useInjectSaga({ key: 'issuesContainer', saga });
  const { owner, repo } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = issuesData !== null && issuesData.length > 0;
    if (loading && loaded) {
      setLoading(false);
    }
  }, [issuesData]);

  useEffect(() => {
    debouncedHandleOnLoad(owner, repo);
  }, []);

  const handleOnLoad = (owner, repo) => {
    dispatchRepoIssues(owner, repo);
    setLoading(true);
  };

  const debouncedHandleOnLoad = debounce(handleOnLoad, 200);

  const renderLabels = labels => {
    if (labels !== null && labels.length) {
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

  const renderIssuesList = () => {
    return (
      ((issuesData !== null && issuesData.length !== 0) || loading) && (
        <CustomCard>
          <Skeleton loading={loading} active>
            {issuesData.map((data, index) => {
              return (
                <a key={index} href={data.htmlUrl}>
                  <CustomCard title={data.title} key={index}>
                    <div>Issues Number: {data.number} </div>
                    <div>State: {data.state}</div>
                    <div>Labels: {renderLabels(data.labels)}</div>
                  </CustomCard>
                </a>
              );
            })}
          </Skeleton>
        </CustomCard>
      )
    );
  };
  return (
    <Container maxWidth={maxWidth} padding={padding}>
      <CustomCard title={`Issues for Repository: ${repo}`}>
        <div>
          By <h3 style={{ display: 'inline' }}>{owner}</h3>
        </div>
      </CustomCard>
      {renderIssuesList()}
    </Container>
  );
}

IssuesContainer.propTypes = {
  dispatchRepoIssues: PropTypes.func,
  issuesData: PropTypes.array,
  issuesError: PropTypes.string,
  maxWidth: PropTypes.number,
  padding: PropTypes.number
};

IssuesContainer.defaultProps = {
  maxWidth: 500,
  padding: 20
};

const mapStateToProps = createStructuredSelector({
  issuesContainer: selectIssuesContainer(),
  issuesData: selectIssuesData(),
  issuesError: selectIssuesError(),
  repoName: selectRepoName(),
  userName: selectUserName()
});

function matchDispatchToProps(dispatch) {
  const { requestGetRepoIssues } = issuesContainerCreators;
  return {
    dispatchRepoIssues: (userName, repoName) => {
      return dispatch(requestGetRepoIssues(userName, repoName));
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  matchDispatchToProps
);

export default compose(
  withConnect,
  memo
)(IssuesContainer);
