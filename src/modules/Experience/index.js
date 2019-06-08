import React from 'react'
import { compose } from 'redux'
import withAuth from 'lib/hocs/apolloAuth'
import DateCell from 'components/DateCell'
import ProfilePage, { profilePropsKeys, dataFormatter } from 'components/Profile/ProfilePage'
import withBasePage from 'lib/hocs/basePage'
import pick from 'lodash/pick'
import { generateQueryById } from 'apollo/query'
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
  return (
    <ProfilePage
      columns={getColumns()}
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

const fields = ['id', 'position', 'start_date', 'end_date', 'company']
// function getListRequestData(user) {
//   return { user_id: user.id, fields}
// }

const basePageProps = {
  // getListRequestData,
  node: 'experience',
  dialogPath: 'Experience',
  pageName: 'Experience',
  dataFormatter,
  listQuery: EXPERIENCE_QUERY,
  detailsQuery: generateQueryById({
    node: 'experience',
    keys: fields
  })
}

export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Experience)
