import React from 'react'
import {
  GetProfileData
} from 'redux/profile/actions'
import { compose } from 'redux'
import withAuth from 'lib/hocs/apolloAuth'
import withBasePage from 'lib/hocs/basePage'
import pick from 'lodash/pick'
import { capitalizeCell, formatDate } from 'components/DataTable/CellFormatter'
import ProfilePage, { profilePropsKeys } from 'components/Profile/ProfilePage'
import { useQuery } from 'react-apollo-hooks'
import { useAppData } from 'apollo/query'
import gql from 'graphql-tag'

const APPLICATION_QUERY = gql`
  query getApplication($user_id: uuid) {
    application(where: {id: {_eq: $user_id}}) {
      id
      status
      company {
        name
      }
      job {
        name
      }
    }
  }
`

function Applications(props) {
  const [appData] = useAppData()
  const { auth } = appData
  const { data } = useQuery(APPLICATION_QUERY, { variables: { user_id: auth.id } })
  return (
    <ProfilePage
      columns={getColumns()}
      rows={data.application || []}
      pageIcon='work'
      pageName='My Applications'
      readOnly
      {...pick(props, profilePropsKeys)}
    />
  )

  function getColumns() {
    return [
      {
        accessor: 'job_name',
        title: 'Job'
      },
      {
        accessor: 'company_name',
        title: 'Company'
      },
      {
        type: 'function',
        title: 'Date Applied',
        fn: formatDate('application_date', 'MMMM DD, YYYY')
      },
      {
        type: 'function',
        title: 'Status',
        fn: capitalizeCell('status')
      }
    ]
  }
}

function getListRequestData({ id }) {
  return { user_id: id }
}

const basePageProps = {
  getListRequestData,
  node: 'application',
  reducer: 'profile',
  getListRequestAction: GetProfileData,
  dataPropKey: 'applications',
  dialogProps: {
    fullWidth: true,
    maxWidth: 'lg'
  },
  pageName: 'My Applications'
}


export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Applications)