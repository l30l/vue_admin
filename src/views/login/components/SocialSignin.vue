<template>
  <div class="social-signin-container">
    <div class="signin-btn" @click="wechatHandleClick">
      <span class="wechat-svg-container">
        <svg-icon icon-class="wechat" class="icon"></svg-icon>
      </span>
      <span>Wechat</span>
    </div>
    <div class="signin-btn" @click="qqHandleClick">
      <span class="qq-svg-container">
        <svg-icon icon-class="qq" class="icon"></svg-icon>
      </span>
      <span>QQ</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialSignin',
  methods: {
    wechatHandleClick() {
      alert('Wechat Sign in Page')
    },
    qqHandleClick() {
      alert('QQ Sign in Page')
    }
  }
}
</script>

<style lang="less" scoped>
.social-signin-container {
  margin: 20px 0;
  .signin-btn {
    display: inline-block;
    cursor: pointer;
  }
  .icon {
    margin-top: 8px;
    font-size: 24px;
    color: #fff;
  }
  .wechat-svg-container,
  .qq-svg-container {
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
    margin-right: 5px;
    border-radius: 4px;
    padding-top: 1px;
    line-height: 40px;
    text-align: center;
    background-color: red;
  }
  .wechat-svg-container {
    background-color: #24da70;
  }
  .qq-svg-container {
    margin-left: 50px;
    background-color: #6ba2d6;
  }
}
</style>
