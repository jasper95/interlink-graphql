import React from 'react'
import { compose } from 'redux'
import withAuth from 'lib/hocs/apolloAuth'
import DateCell from 'components/DateCell'
import ProfilePage, { profilePropsKeys, dataFormatter } from 'components/Profile/ProfilePage'
import withBasePage from 'lib/hocs/basePage'
import pick from 'lodash/pick'
import { generateQueryById } from 'apollo/query'
import gql from 'graphql-tag'

const EDUCATION_QUERY = gql`
  query getEducation($user_id: uuid) {
    education(where: {user_id: {_eq: $user_id}}) {
      id,
      school
      job_category {
        id
        name
      }
      start_date
      end_date
      qualification
    }
  }
`

function Education(props) {
  const { onDelete, onEdit } = props
  return (
    <ProfilePage
      columns={getColumns()}
      pageIcon='school'
      pageName='Education'
      {...pick(props, profilePropsKeys)}
    />
  )

  function getColumns() {
    return [
      {
        accessor: 'job_category.name',
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

const fields = ['id', 'job_category { id name }','start_date', 'end_date', 'qualification', 'school']

const basePageProps = {
  node: 'education',
  pageName: 'Education',
  dialogPath: 'Education',
  dataFormatter,
  listQuery: EDUCATION_QUERY,
  detailsQuery: generateQueryById({
    node: 'education',
    keys: fields
  })
}

export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Education)