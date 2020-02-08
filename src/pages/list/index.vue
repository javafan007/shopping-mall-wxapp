
<template>
  <div class="wrap">
    <div class="msg">{{msg}}</div>
    <van-switch :checked="checked" @change="onChange" />
  </div>
</template>

<script>
  import $http from '../../api/api-request'

  export default {
    data () {
      return {
        checked: true,
        msg: 'Hello World'
      }
    },
    created () {
      $http.get('sub/list').then(res => {
        console.log('--->', res)
      })
    },
    methods: {
      onChange (e) {
        console.log('---->', e.mp.detail)
        this.checked = e.mp.detail
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    border: 1px solid #ddd;
    .msg {
      color: #1989fa;
    }
  }
</style>
