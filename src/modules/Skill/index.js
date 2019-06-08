import React from 'react'
import { compose } from 'redux'
import withAuth from 'lib/hocs/apolloAuth'
import ProfilePage, { profilePropsKeys, dataFormatter } from 'components/Profile/ProfilePage'
import {
  GetProfileData
} from 'redux/profile/actions'
import withBasePage from 'lib/hocs/basePage'
import pick from 'lodash/pick'
import { useQuery } from 'react-apollo-hooks'
import { useAppData } from 'apollo/query'
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
  const [appData] = useAppData()
  const { auth } = appData
  const { data } = useQuery(SKILL_QUERY, { variables: { user_id: auth.id } })
  return (
    <ProfilePage
      columns={getColumns()}
      rows={data.skill || []}
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

function getListRequestData(user) {
  return { user_id: user.id, fields: ['id', 'name', 'level']}
}

const basePageProps = {
  getListRequestData,
  dataFormatter,
  node: 'skill',
  dialogPath: 'Skill',
  pageName: 'Skill',
  getListRequestAction: GetProfileData,
  dataPropKey: 'skills',
  reducer: 'profile'
}

export default compose(
  withAuth(),
  withBasePage(basePageProps)
)(Skill)