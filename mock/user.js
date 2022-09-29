import Mock from 'mockjs'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

Mock.mock(`${process.env.VUE_APP_BASE_API}/vue-element-admin/user/login`, 'post', function (config) {
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
})
