<template>
  <div class="login-container">
    <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form">
      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          type="text"
          v-model="loginForm.username"
          name="username"
          placeholder="Username"
          autocomplete="on"
          tabindex="1"
        ></el-input>
      </el-form-item>

      <el-tooltip v-model="capsToolTip" content="Caps lock is on" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            ref="password"
            :type="passwordType"
            v-model="loginForm.password"
            name="password"
            placeholder="Password"
            autocomplete="on"
            tabindex="2"
            @keyup.native="checkCapslock"
            @keyup.enter.native="handleLogin"
          ></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"></svg-icon>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >

      <div class="other">
        <div class="tips">
          <span>Username : admin</span>
          <span>Password : any</span>
        </div>
        <div class="tips">
          <span style="margin-right: 18px">Username : editor</span>
          <span>Password : any</span>
        </div>

        <el-button class="thirdparty-button" type="primary" @click="dialogVisible = true"
          >Or connect with</el-button
        >
      </div>
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="dialogVisible" width="35%">
      <social-signin></social-signin>
    </el-dialog>
  </div>
</template>

<script>
import SocialSignin from './components/SocialSignin'
import { validateUname } from '@/utils/validate'
export default {
  name: 'Login',
  components: { SocialSignin },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validateUname(value)) {
        callback(new Error('Please enter the correct username'))
      } else {
        callback()
      }
    }
    const validatePwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
        password: [{ required: true, validator: validatePwd, trigger: 'blur' }]
      },
      dialogVisible: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      passwordType: 'password',
      capsToolTip: false
    }
  },
  watch: {
    $route: {
      handler: function (newRoute) {
        console.log(newRoute)
        const query = newRoute.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsToolTip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((pre, cur) => {
        if (cur !== 'redirect') {
          pre[cur] = query[cur]
        }
        return pre
      }, {})
    }
  }
}
</script>

<style lang="less">
@bg: #283443;
@light_gray: #fff;
@cursor: #fff;

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      height: 47px;
      padding: 12px 5px 12px 15px;
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: @light_gray;
      caret-color: @cursor;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="less" scoped>
@bg: #2d3a4b;
@dark_gray: #889aa4;
@light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: @bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: @light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .svg-container {
    display: inline-block;
    width: 30px;
    vertical-align: middle;
    padding: 6px 5px 6px 15px;
    color: @dark_gray;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: @dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .other {
    position: relative;
    .tips {
      margin-bottom: 10px;
      font-size: 14px;
      color: #fff;

      span:first-of-type {
        margin-right: 16px;
      }
    }
    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }
    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
}
</style>
