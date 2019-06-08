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

const EDUCATION_QUERY = gql`
  query getEducation($user_id: uuid) {
    education(where: {user_id: {_eq: $user_id}}) {
      id,
      school
      job_category {
        name
        id
      }
      start_date
      end_date
    }
  }
`

function Education(props) {
  const { onDelete, onEdit } = props
  const [appData] = useAppData()
  const { auth } = appData
  const { data } = useQuery(EDUCATION_QUERY, { variables: { user_id: auth.id } })
  return (
    <ProfilePage
      columns={getColumns()}
      rows={data.education || []}
      pageIcon='school'
      pageName='Education'
      {...pick(props, profilePropsKeys)}
    />
  )

  function getColumns() {
    return [
      {
        accessor: 'job_category',
        title: 'Field of Study'
      },
      {
        accessor: 'qualification',
        title: 'Qualifications'
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
  return { user_id: user.id, fields: ['id', 'job_category','job_category_id', 'start_date', 'end_date', 'qualification', 'school']}
}

const basePageProps = {
  getListRequestData,
  node: 'education',
  pageName: 'Education',
  dialogPath: 'Education',
  getListRequestAction: GetProfileData,
  dataPropKey: 'educations',
  reducer: 'profile',
  dataFormatter
}

export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Education)