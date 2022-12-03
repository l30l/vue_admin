import Mock from 'mockjs'

import { getQuery } from '@/utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

Mock.mock(
  `${process.env.VUE_APP_BASE_API}/vue-element-admin/user/login`,
  'post',
  function (config) {
    const body = JSON.parse(config.body)
    const { username } = body
    const token = tokens[username]
    if (!token) {
      return {
        code: 60204,
        message: 'Account and password are incorrect.'
      }
    }
    return {
      code: 20000,
      data: token
    }
  }
)

Mock.mock(
  new RegExp(`${process.env.VUE_APP_BASE_API}/vue-element-admin/user/info` + '.*'),
  'get',
  function (config) {
    const { token } = getQuery(config.url)
    const userInfo = users[token]
    if (!userInfo) {
      return {
        code: 50008,
        message: 'Login failed, unable to get user details.'
      }
    }
    return {
      code: 20000,
      data: userInfo
    }
  }
)

Mock.mock(`${process.env.VUE_APP_BASE_API}/vue-element-admin/user/logout`, 'post', function () {
  return {
    code: 20000,
    data: 'log out success'
  }
})
