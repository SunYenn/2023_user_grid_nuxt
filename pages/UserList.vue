<template>
  <div class="container">

    <el-button class="logoutBtn" @click="logout" style="margin: 0;">Logout</el-button>

    <div class="header">
      <h3>사용자 관리</h3>
    </div>

    <el-form :model="search_data" @submit.native.prevent="search">
      <div class="form">
        <div>
          <div class="search_div">
            <span class="input-label">ID</span>
            <el-input placeholder="ID" v-model="search_data.user_id">
            </el-input>
          </div>
          <div class="search_div">
            <span class="input-label">이름</span>
            <el-input placeholder="이름" v-model="search_data.user_name">
            </el-input>
          </div>
          <div class="search_div">
            <span class="input-label">전화번호</span>
            <el-input placeholder="전화번호" v-model="search_data.user_telno" @input="regexPhonenum()">
            </el-input>
          </div>
          <div class="search_div">
            <el-button @click="reset">초기화</el-button>
            <el-button type="primary" native-type="search">검색</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="btns">
      <el-button v-if="selectedIdxs.length > 0" @click="test">삭제</el-button>
      <el-button @click="showRegiPop">등록</el-button>
      <!-- <el-button>일괄등록</el-button> -->
      <el-button>Excel 다운로드</el-button>
    </div>

    <div class="components">
      <Table :selectedIdxs="selectedIdxs" :order_data="order_data" @select="setSelectedIdxs" @setOrder="setOrder" />
    </div>

    <div class="footer">
      <el-select v-model="search_data.page_size" style="width: 100px;" @change="chg_pagesize">
        <el-option label="5" value="5" align="center"></el-option>
        <el-option label="7" value="7" align="center"></el-option>
        <el-option label="10" value="10" align="center"></el-option>
      </el-select>
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
        :current-page="current_page" :total="total_page">
      </el-pagination>
    </div>

    <div class="RegiPoP" style="display: none;">
      <Register />
    </div>

  </div>
</template>

<script>
import Table from '@/components/Table.vue';
import Register from '@/components/Register.vue';
import { mapActions } from 'vuex';
import { getCookie } from '@/utils/cookie'

export default {
  components: {
    Table // Table 컴포넌트 등록
  },

  data() {
    return {
      userData: [],
      total_page: 100,
      current_page: 1,
      page_size: 10,
      search_data: {
        user_id: '',
        user_name: '',
        user_telno: '',
      },
      order_data: [{
        user_name_fg: 'asc',
        cre_dt_fg: 'asc',
        udt_dt_fg: 'asc'
      }],
      selectedIdxs: []
    }
  },

  mounted() {
    this.call_axios();
  },

  methods: {

    ...mapActions(['logout']),

    async call_axios() {

      let data = {
        userMst: this.search_data,
        userRoleGrpMap: this.order_data[0]
      }

      await this.$axios.post('/user/list', data, {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
        
      })
      .catch((error) => {
        this.$message.error('권한이 없습니다. \n로그인 화면으로 넘어갑니다.');
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      })

    },

    // 전화번호 검색 정규식
    regexPhonenum() {
      this.search_data.user_telno = this.search_data.user_telno
        .replace(/[^0-9]/g, "")
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
        .replace("--", "-");
    },

    search() {
      this.call_axios()
    },

    chg_pagesize() {

    },
    handleCurrentChange() {

    },

    // props
    setSelectedIdxs(selectedIdxs) {
      this.selectedIdxs = selectedIdxs;
    },
    setOrder(order_data) {
      this.order_data = order_data;
      this.call_axios();
    },

    // 등록창 열기
    showRegiPop() {
      const regiDiv = document.getElementsByClassName("RegiPoP")[0];
      regiDiv.style.display = '';
    },

    // 검색창 초기화
    reset() {
      this.search_data.user_id = '';
      this.search_data.user_name = '';
      this.search_data.user_telno = '';
    }

  }
}
</script>
