import 'react-datepicker/dist/react-datepicker.css';
import React from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import gql from 'graphql-tag'
import Header from './Header'
import Footer from './Footer'
import flow from 'lodash/flow'
import Dialogs from 'components/Dialogs'
import Snackbar from 'components/Snackbar'
import { useQuery, useApolloClient } from 'react-apollo-hooks'
import QUERY from 'apollo/query'
import { setNotification } from 'apollo/mutation'
import 'sass/common.scss'

const { GET_NOTIFICATION } = QUERY

export const RESET_KEY = gql`
  mutation ResetKey($key: any, $query: any) {
    resetKey(key: $key, query: $query) @client 
  }
`

function Page(props) {
  const {
    children, dialog,
    hasNavigation, hasFooter,
    pageId, className, pageDescription, router
  } = props
  const { data = {} } = useQuery(GET_NOTIFICATION, { ssr: false })
  const client = useApolloClient()
  // const [onHideNotification] = useMutation(RESET_KEY,
  //   { variables: { key: 'notification', query: GET_NOTIFICATION } }
  // )
  const { notification } = data
  let { pageTitle } = props
  if (pageTitle) {
    pageTitle = `InternLink - ${pageTitle}`
  } else {
    pageTitle = 'Internlink'
  }
  let Dialog
  if (dialog && dialog.path) {
    Dialog = Dialogs[dialog.path]
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property='og:title' content={pageTitle} />
        <meta name='og:description' content={pageDescription || 'Description here'} />
        {router.asPath !== '/' && (
          <link rel='canonical' href={`${process.env.HOSTNAME}/${router.asPath}`} />
        )}
      </Head>
      {hasNavigation && (
        <Header />
      )}
      {notification && (
        <Snackbar
          onClose={() => {
            setNotification(null)(client)
          }}
          open={!!notification}
          {...notification}
        />
      )}
      {Dialog && (
        <Dialog {...dialog.props} />
      )}

      <main className={`page page-${pageId} ${className}`}>
        {children}
      </main>


      {hasFooter && (
        <Footer/>
      )}
    </>
  )
}

const EnhancedPage = flow(withRouter)(Page)

EnhancedPage.defaultProps = {
  hasNavigation: true,
  hasFooter: true,
  pageId: ''
}

export default EnhancedPage