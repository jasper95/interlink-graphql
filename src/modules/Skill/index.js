import React from 'react'
import { compose } from 'redux'
import withAuth from 'lib/hocs/apolloAuth'
import ProfilePage, { profilePropsKeys, dataFormatter } from 'components/Profile/ProfilePage'
import withBasePage from 'lib/hocs/basePage'
import pick from 'lodash/pick'
import { generateQueryById } from 'apollo/query'
import gql from 'graphql-tag'

const SKILL_QUERY = gql`
  query getSkill($user_id: uuid) {
    skill(where: {user_id: {_eq: $user_id}}) {
      id
      name
      level
    }
  }
`

function Skill(props) {
  const { onEdit, onDelete } = props
  return (
    <ProfilePage
      columns={getColumns()}
      pageIcon='account_box'
      pageName='Skill'
      {...pick(props, profilePropsKeys)}
    />
  )

  function getColumns() {
    return [
      {
        accessor: 'name',
        title: 'Skill or Expertise'
      },
      {
        accessor: 'level',
        title: 'Level'
      },
      {
        title: 'Actions',
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

const basePageProps = {
  dataFormatter,
  node: 'skill',
  dialogPath: 'Skill',
  pageName: 'Skill',
  listQuery: SKILL_QUERY,
  detailsQuery: generateQueryById({
    node: 'skill',
    keys: ['id', 'name', 'level']
  })
}

export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Skill)