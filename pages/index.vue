<template>
  <div class="container login">
    <el-form :model="form" :rules="validationRules" ref="form" @submit.native.prevent="login">
      <div class="header">
        <h1>LOGIN</h1>
      </div>

      <div class="body">
        <el-form-item prop="user_id" :error="errors['user_id']">
          <el-input 
            ref="form_user_id" 
            v-model="form.user_id" 
            placeholder="ID" 
          />
        </el-form-item>
        <el-form-item prop="user_pwd" :error="errors['user_pwd']">
          <el-input 
            ref="form_user_pwd" 
            type="password" 
            v-model="form.user_pwd" 
            placeholder="Password" 
          />
        </el-form-item>

        <el-button type="primary" native-type="login">로그인</el-button>

      </div>
    </el-form>
  </div>
</template>

<script>
export default {

  data() {
    return {
      form: {
        user_id: '',
        user_pwd: '',
      },
      errors: {},

      validationRules: {
        user_id: [{ required: true, message: '아이디를 입력해주세요.', trigger: 'blur' }],
        user_pwd: [{ required: true, message: '비밀번호를 입력해주세요.', trigger: 'blur' }]
      }
    }
  },

  methods: {

    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { user_id, user_pwd} = this.form;
          this.$store.dispatch('login', { user_id, user_pwd}) // 로그인
        } else {
          this.$message.error('양식을 다시 확인해주세요.');
        }
      });
    },

  }
}

</script>
