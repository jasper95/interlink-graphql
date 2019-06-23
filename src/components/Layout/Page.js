import 'react-datepicker/dist/react-datepicker.css';
import React from 'react'
import Head from 'next/head'
import { withRouter } from 'next/router'
import Header from './Header'
import Footer from './Footer'
import flow from 'lodash/flow'
import Dialogs from 'components/Dialogs'
import Snackbar from 'components/Snackbar'
import { useAppData } from 'apollo/query'
import 'sass/common.scss'

function Page(props) {
  const {
    children,
    hasNavigation, hasFooter,
    pageId, className, pageDescription, router
  } = props
  const [appData, setAppData] = useAppData()
  const { toast, dialog } = appData
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
  console.log(router)
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
      {toast && (
        <Snackbar
          onClose={() => setAppData('toast', null)}
          open={!!toast}
          {...toast}
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