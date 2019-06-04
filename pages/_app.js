import React from 'react';
import App, { Container } from 'next/app'
import Head from 'next/head'
import withApollo from 'lib/apollo/withApollo'
import { ApolloProvider } from 'react-apollo-hooks'
import Router from 'next/router'
import NProgress from 'nprogress'
import { compose } from 'redux'

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <Head>
          <title>My page</title>
        </Head>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default compose(
  withApollo
)(MyApp)