import React from 'react'
import Paper from 'react-md/lib/Papers/Paper'
import { compose } from 'redux'
import FontIcon from 'react-md/lib/FontIcons/FontIcon'
import Profile from 'components/Profile'
import withAuth from 'lib/hocs/apolloAuth'
import Button from 'react-md/lib/Buttons/Button'
import {
  ShowDialog,
  Upload
} from 'redux/app/actions'
import {
  SetUserAuth
} from 'redux/auth/actions'
import day from 'dayjs'
import {
  formatDateToISO, formatISOToDate, getAddressDescription
} from 'lib/tools'
import { formatAddress } from 'components/Profile/User'
import { useAppData } from 'apollo/query'
import { useUpdateNode } from 'apollo/mutation'

function AboutMe(props) {
  const [appData, setAppData] = useAppData()
  const [updateNode] = useUpdateNode({
    node: 'system_user',
    message: 'Profile details successfull updated'
  })
  const { auth: user } = appData
  if (!user) {
    return null
  }
  return (
    <Profile>
      <Paper className='profileInfoCard'>
        <h1 className='profileInfoCard_header'>
          <FontIcon children='person'/>
          <span className='title'>
            About Me
            <span className='action'>
              <span 
                className='action_item' 
                onClick={handleUploadResume}
                children='Upload resume'
              />
            </span>
          </span>
        </h1>


        <div>
          <Info label='Name' value={`${user.first_name} ${user.last_name}`} />
          <Info label='Contact Number' value={user.contact_number} />
          <Info label='Email' value={user.email} />
          <Info label='Address' value={formatAddress(user.address_description, user.address)} />
          <Info label='Date of Birth' value={user.birth_date ? day(user.birth_date).format('YYYY-MM-DD') : '' } />
          <Info label='Nationality' value={user.nationality} />
          <Info label='Resume' value={user.resume ? user.resume : 'Not Available' } />
        </div>


        <div className='profileInfoCard_actions'>
          <Button
            onClick={handleUpdate}
            className='iBttn iBttn-primary'
            children='Edit'
          />
        </div>
      </Paper>
    </Profile>
  )

  function handleUpdate() {
    setAppData('dialog', {
      path: 'AboutMe',
      props: {
        initialFields: formatISOToDate(user, ['birth_date'], 'YYYY-MM-DD'),
        title: 'Edit About Me',
        onValid: (data) => {
          updateNode({
            variables: {
              input: {
                ...formatDateToISO(data, ['birth_date'], 'YYYY-MM-DD'),
                address_description: getAddressDescription(data)
              }
            }
          })
        }
      }
    })
  }

  function handleUploadResume() {
    dispatch(ShowDialog({
      path: 'Upload',
      props: {
        title: 'Upload Resume',
        onValid: (data) => {
          dispatch(Upload({
            data: {
              ...data,
              node: 'user',
              id: user.id,
              type: 'resume'
            },
            callback: handleUpdateCallback
          }))
        }
      }
    }))
  }

  function handleUpdateCallback(data) {
    dispatch(SetUserAuth({
      ...user,
      ...data
    }))
  }
}

function Info({ label, value }) {
  return (
    <div className='infoField'>
      <p className='infoField_key'>{label}</p>
      <p className='infoField_value'>{value}</p>
    </div>
  )
}


export default compose(
  withAuth()
)(AboutMe)