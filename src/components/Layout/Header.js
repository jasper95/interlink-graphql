import React, { useContext } from 'react'
import Link from 'next/link';
import Button from 'react-md/lib/Buttons/Button'
import ImageLoader from 'react-image'
import { Logout } from 'redux/auth/actions'
import { ShowDialog } from 'redux/app/actions'
import DropdownMenu from 'react-md/lib/Menus/DropdownMenu'
import FontIcon from 'react-md/lib/FontIcons/FontIcon'
import Avatar from 'react-md/lib/Avatars/Avatar'
import ListItem from 'react-md/lib/Lists/ListItem'
import Subheader from 'react-md/lib/Subheaders/Subheader'
import Divider from 'react-md/lib/Dividers/Divider'
import Badge from 'react-md/lib/Badges/Badge'
import { format as formatTime } from 'timeago.js'
import gql from 'graphql-tag'
import { useManualQuery, useAppData } from 'apollo/query'

import 'sass/components/nav/index.scss'

const NOTIFICATION_QUERY = gql`
  query userNotification($user_id: uuid){
    notification(where: {user_id: {_eq: $user_id }}) {
      body
      created_date
      id
      status
    }
  }
`

function Header(props) {
  const {
    avatarLink = ''
  } = props
  const [appData] = useAppData()
  const { auth: user } = appData
  const [notifStates, notifHandlers] = useManualQuery(
    NOTIFICATION_QUERY,
    {
      variables: {
        user_id: user && user.id
      }
    },
    { notification: [] }
  )
  const isAuthenticated = Boolean(user)
  return (
    <nav className='nav'>
      <div className='nav_container'>
        <Link href='/'>
          <img 
            src='/static/img/logo.png' 
            alt=''
            className='nav_logo'
          />
        </Link>

        <div className='nav_actions'>
          <div className='nav_menu'>
            <ul className='nav_menu_list'>
              <li className='nav_menu_list_item'>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className='nav_profile'>
            {renderProfileNav()}
          </div>
        </div>
      </div>
    </nav>
  );

  function renderProfileNav() {
    let profileNav = (
      <Link href='/login'>
        <Button flat className='iBttn iBttn-primary nav_profile_login'>
          Login
        </Button>
      </Link>
    )
    if (isAuthenticated) {
      const profileLink = user.company ? `/company/${user.company.slug}` : `/user/${user.slug}`
      const displayName = [
        user.first_name,
        user.last_name,
        user.company && user.company.name
      ].filter(Boolean).join(' ')
      profileNav = (
        <>
          <div className='nav_profile_avatar'>
            <ImageLoader
              key={avatarLink}
              src={[avatarLink, '/static/img/default-avatar.png']}
            />
          </div>
          <div className='nav_profile_content'>
            <p 
              className='name'
            >
              <Link href={profileLink}>
                <a>
                  {displayName}
                </a>
              </Link>
            </p>
            <p className='logout' 
              onClick={handleClickLogout}>
              Logout
            </p>
          </div>
          <DropdownMenu 
            id='notif'
            menuItems={renderNotifications()}
            onVisibilityChange={(visible) => {
              if (visible) {
                notifHandlers.onQuery()
              }
            }}
            anchor={{
              x: DropdownMenu.HorizontalAnchors.INNER_LEFT,
              y: DropdownMenu.VerticalAnchors.BOTTOM,
            }}
          >
            <Badge
              badgeContent={Number(user.unread_notifications)}
              invisibleOnZero
              secondary
              badgeId="notifications-2"
            >
              <Button
                icon
                children='notifications'
                className='nav_profile_notification'
              />
            </Badge>
          </DropdownMenu>
        </>
      )
    }
    return profileNav
  }

  function handleClickLogout() {
    dispatch(ShowDialog({
      path: 'Confirm',
      props: {
        title: 'Confirm Logout',
        message: 'Do you really want to logout?',
        onValid: () => {
          dispatch(Logout())
        }
      }
    }))
  }

  function renderNotifications() {
    const { notification: notifications = [] } = notifStates.data
    const unreadNotifications = notifications.filter(e => e.status === 'unread')
    const readNotifications = notifications.filter(e => e.status !== 'unread')
    return [
      unreadNotifications.length && <Subheader primaryText='Unread Notifications' key='new-header' />,
      ...unreadNotifications.map(itemMapper),
      readNotifications.length && unreadNotifications.length && <Divider inset key='divider' />,
      readNotifications.length && <Subheader primaryText='Read Notifications' key='old-header' />,
      ...readNotifications.map(itemMapper)
    ].filter(Boolean)
  }

  function itemMapper(item) {
    const { id, body: { icon, type, message }, created_date: createdDate } = item
    return (
      <ListItem
        key={id}
        leftAvatar={
          <Avatar
            suffix={type === 'success' ? 'green' : 'yellow'}
            icon={<FontIcon>{icon}</FontIcon>}
          />
        }
        primaryText={message}
        secondaryText={formatTime(createdDate)}
      />
    )
  }

  function handleGetNotification() {
    // notifHandlers.onQuery()
    // dispatch(SetUserAuth({
    //   ...user,
    //   unread_notifications: 0
    // }))
    // dispatch(GetProfileData({
    //   key: 'notifications',
    //   url: '/user/notification'
    // }))
  }
}

export default Header