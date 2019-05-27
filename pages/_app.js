import React from 'react';
import App, { Container } from 'next/app'
import Head from 'next/head'
import withRedux from 'next-redux-wrapper'
import withReduxSaga from 'next-redux-saga'
import withApollo from 'lib/apollo/withApollo'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import createStore from 'redux/store'
import Router from 'next/router'
import NProgress from 'nprogress'
import { compose } from 'redux'

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class MyApp extends App {
  render() {
    const { Component, pageProps, store, apolloClient } = this.props;
    return (
      <Container>
        <Head>
          <title>My page</title>
        </Head>
        <ApolloProvider client={apolloClient}>
          {/* <Provider store={store}> */}
            <Component {...pageProps} />
          {/* </Provider> */}
        </ApolloProvider>
      </Container>
    );
  }
}

export default compose(
  // withRedux(createStore),
  // withReduxSaga,
  withApollo
)(MyApp)