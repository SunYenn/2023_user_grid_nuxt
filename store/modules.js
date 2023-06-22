import { setCookie, getCookie, deleteCookie } from '@/utils/cookie' // 쿠키 유틸리티 함수 임포트

export default {

  getters: {
    Name() {
      return getCookie('name');
    },
    BackURL() {
      return `http://${window.location.hostname}:8080/api/`;
    },
    FrontURL() {
      return `http://${window.location.host}/`;
    }
  },

  actions: {
    login({commit}, { user_id, user_pwd, last_login_ip }) {

      const params = {
        ettUserMst: {
          user_id : user_id,
          last_login_ip : last_login_ip
        },
        ettUserPwd: {
          user_pwd : user_pwd
        },
      }

      this.$axios.post("http://localhost:8080/api/auth/login", params)
      .then(res => {
        alert("정보가 확인되었습니다.\n환영합니다!")
        commit('login', res);
        setCookie('token', res.headers['accesstoken']);
        setCookie('name', res.data['ettUserMst']['user_name']);
        setCookie('id', res.data['ettUserMst']['user_id']);
        setCookie('role', res.data['ettRoleGrp']['role_grp_name']);
        this.$router.push("/UserList")
      }).catch(e => {
        console.log(e)
        alert("로그인 요청에 문제가 발생했습니다.")
      })

    },

    logout() {
      deleteCookie('token');
      deleteCookie('name');
      deleteCookie('id');
      deleteCookie('role');
      this.$router.push("./");
      },
  }
}