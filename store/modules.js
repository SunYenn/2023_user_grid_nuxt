import { setCookie, getCookie, deleteCookie } from '@/utils/cookie' // 쿠키 유틸리티 함수 임포트

export default {

  getters: {
    Name() {
      return getCookie('name');
    },
    BackURL() {
      console.log("getBackurl : " + window.location.hostname);
      return `http://${window.location.hostname}:8080/api/`;
    },
    FrontURL() {
      return `http://${window.location.host}/`;
    }
  },

  actions: {
    login({commit}, { user_id, user_pwd}) {

      const params = {
        ettUserMst: {
          user_id : user_id,
        },
        ettUserPwd: {
          user_pwd : user_pwd
        },
      }

      this.$axios.post("http://192.168.1.139:8080/api/auth/login", params)
      .then(res => {
        alert("정보가 확인되었습니다.\n환영합니다!")
        setCookie('token', res.headers['accesstoken']);
        this.$router.push("/choose")
      }).catch(e => {
        console.log(e)
        alert("로그인 요청에 문제가 발생했습니다.")
      })

    },

    logout() {
      deleteCookie('token');
      this.$router.push("/");
    },
  }
}