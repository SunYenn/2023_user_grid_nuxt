<template>
  <div class="container choose">
    <div class="header">
      <h1>관리 목록</h1>
    </div>

    <div class="buttons">
      <el-button @click="userList">사용자 관리</el-button>
      <el-button @click="grpList">그룹 관리</el-button>
    </div>

    <div class="center">
      <el-button @click="logout" type="info" plain>로그아웃</el-button>
    </div>

  </div>
</template>

<script>
import { getCookie } from '@/utils/cookie'
import { mapActions } from 'vuex';

  export default {

    mounted() {
      if(getCookie('token') === null) {
        this.$message.error('로그인되지 않았습니다. \n로그인 화면으로 넘어갑니다.');
        setTimeout(() => {
          this.logout();
        }, 500);
      }
    },

    methods : {
      ...mapActions(['logout']),

      userList() {
        this.$router.push("./UserList")
      },
      grpList() {
        this.$router.push("./RoleList")
      }
    }
  }

</script>