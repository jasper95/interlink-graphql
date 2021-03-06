import React from 'react';
import App, { Container } from 'next/app'
import Head from 'next/head'
import withApollo from 'lib/hocs/withApollo'
import { ApolloProvider } from 'react-apollo-hooks'
import Router from 'next/router'
import NProgress from 'nprogress'
import initApollo from 'apollo/initApollo'
import initialState from 'apollo/initialState'
import { compose } from 'redux'

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps }
  }

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
  withApollo(initApollo, initialState)
)(MyApp)