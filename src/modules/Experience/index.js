import React from 'react'
import { compose } from 'redux'
import withAuth from 'lib/hocs/apolloAuth'
import DateCell from 'components/DateCell'
import ProfilePage, { profilePropsKeys, dataFormatter } from 'components/Profile/ProfilePage'
import {
  GetProfileData
} from 'redux/profile/actions'
import withBasePage from 'lib/hocs/basePage'
import pick from 'lodash/pick'
import { useQuery } from 'react-apollo-hooks'
import { useAppData } from 'apollo/query'
import gql from 'graphql-tag'

const EXPERIENCE_QUERY = gql`
  query GetExperience($user_id: uuid) {
    experience(where: {user_id: {_eq: $user_id }}) {
      id
      position
      start_date
      end_date
      company
    }
  }
`

function Experience(props) {
  const { onDelete, onEdit } = props
  const [appData] = useAppData()
  const { auth } = appData
  const { data } = useQuery(EXPERIENCE_QUERY, { variables: { user_id: auth.id } })
  return (
    <ProfilePage
      columns={getColumns()}
      rows={data.experience || []}
      pageIcon='work'
      pageName='Experience'
      {...pick(props, profilePropsKeys)}
    />
  )

  function getColumns() {
    return [
      {
        accessor: 'position',
        title: 'Position'
      },
      {
        accessor: 'company',
        title: 'Company'
      },
      {
        type: 'component',
        title: 'Dates',
        component: DateCell
      },
      {
        type: 'actions',
        actions: [
          {
            icon: 'edit',
            label: 'Edit',
            onClick: onEdit
          },
          {
            icon: 'delete',
            label: 'Delete',
            onClick: onDelete
          }
        ]
      }
    ]
  }
}

function getListRequestData(user) {
  return { user_id: user.id, fields: ['id', 'position', 'start_date', 'end_date', 'company']}
}

const basePageProps = {
  getListRequestData,
  node: 'experience',
  dataPropKey: 'experiences',
  dialogPath: 'Experience',
  pageName: 'Experience',
  reducer: 'profile',
  getListRequestAction: GetProfileData,
  dataFormatter 
}

export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Experience)
