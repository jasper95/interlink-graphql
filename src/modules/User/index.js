import React from 'react'
import withAuth from 'lib/hocs/apolloAuth'
import { Download } from 'redux/app/actions'
import Profile from 'components/Profile'
import UserDetails from 'components/Profile/User'
import { useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import pick from 'lodash/pick'
import Error from 'next/error'
import omit from 'lodash/omit'

const USER_QUERY = gql`
query GetUser($slug: String) {
  system_user(where: {slug: {_eq: $slug }}) {
      id
      first_name
      last_name
      address_description
      address
      skills {
        id
        name
        level
      }
      experiences {
        id
        position
        start_date
        end_date
      }
      educations {
        id,
        job_category {
          name
        }
        start_date
        end_date
        qualification
        school
      }
    }
  }
`

function UserProfile(props) {
  const { dispatch } = props
  const { query = { } } = props
  const { id = '' } = query
  const { data } = useQuery(USER_QUERY, { variables: { slug: id } })
  if (data && data.system_user && data.system_user.length) {
    const [profile] = data.system_user
    return (
      <Profile>
        <UserDetails
          onDownloadResume={handleDownloadResume}
          profile={omit(profile, 'skills', 'skills', 'educations', 'experiences')}
          {...pick(profile, ['profile', 'skills', 'educations', 'experiences'])}
        />
      </Profile>
    )
  }
  return <Error statusCode={404} />

  function handleDownloadResume() {
    const { profile } = props
    dispatch(Download({ id: profile.id, type: 'resume', node: 'user', attachment: true }))
  }
}

export default withAuth('optional')(UserProfile)