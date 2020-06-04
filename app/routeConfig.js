import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import IssuesContainer from '@containers/IssuesContainer/Loadable';

export const routeConfig = {
  issues: {
    component: IssuesContainer,
    route: '/:owner/:repo/issues',
    props: {
      maxwidth: 500,
      padding: 20
    },
    exact: true
  },
  repos: {
    component: HomeContainer,
    route: '/',
    // add props to pass to HomeContainer
    props: {
      maxwidth: 500,
      padding: 20
    },
    exact: true
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
