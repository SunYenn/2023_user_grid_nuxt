<template>
  <div class="container">

    <el-button class="logoutBtn" @click="logout" style="margin: 0;">Logout</el-button>

    <div class="header">
      <h3>사용자 관리</h3>
    </div>

    <el-form :model="paging[0]" @submit.native.prevent="call_axios">
      <div class="form">
        <div>
          <div class="search_div">
            <span class="input-label">ID</span>
            <el-input placeholder="ID" v-model="paging[0].search_id">
            </el-input>
          </div>
          <div class="search_div">
            <span class="input-label">이름</span>
            <el-input placeholder="이름" v-model="paging[0].search_name">
            </el-input>
          </div>
          <div class="search_div">
            <span class="input-label">전화번호</span>
            <el-input placeholder="전화번호" v-model="paging[0].search_telno" @input="regexPhonenum()">
            </el-input>
          </div>
          <div class="search_div">
            <el-button @click="reset">초기화</el-button>
            <el-button type="primary" native-type="call_axios">검색</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="btns">
      <el-button v-if="selectedIdxs.length > 0" @click="deleteUsers">삭제</el-button>
      <el-button @click="showRegiPop">등록</el-button>
      <el-button @click="excelDown">Excel 다운로드</el-button>
    </div>

    <div class="components">
      <Table 
        :selectedIdxs="selectedIdxs" :paging="paging" :tableData="tableData" :selectedRows="selectedRows"
        @select="setSelectedIdxs" @setPaging="setPaging" @altercontent="setContent" @setRows="setRows"
      />
    </div>

    <div class="footer paging">
        <el-select v-model="paging[0].page_size" style="width: 100px;" @change="call_axios">
          <el-option label="5" value="5" align="center"></el-option>
          <el-option label="7" value="7" align="center"></el-option>
          <el-option label="10" value="10" align="center"></el-option>
        </el-select>
        <el-pagination 
          background layout="prev, pager, next" 
          @current-change="handleCurrentChange"
          :current-page="paging[0].current_page" 
          :total="total_page"
        >
        </el-pagination>
    </div>

    <div class="RegiPoP" style="display: none;">
      <Register />
    </div>

    <div class="AlterPoP" style="display: none;">
      <Alter :userData="userData" />
    </div>

  </div>
</template>

<script>
import Table from '@/components/Table.vue';
import Register from '@/components/Register.vue';
import Alter from '@/components/Alter.vue';
import { mapActions } from 'vuex';
import { getCookie } from '@/utils/cookie'

export default {

  data() {
    return {
      tableData: [],
      total_page: 0,
      
      paging : [{
        page_size: 10, 
        current_page: 1,

        user_name_fg: '',
        cre_dt_fg: '',
        udt_dt_fg: '',

        search_id : '',
        search_name : '',
        search_telno : ''

      }],
      selectedIdxs: [],
      selectedRows: [],
      userData: []
    }
  },

  mounted() {
    this.call_axios();
    this.selectedRows = this.arrayFill();
    window.addEventListener('keydown', this.escDown);
  },

  methods: {

    ...mapActions(['logout']),

    async call_axios() {

      await this.$axios.post('/user/list', this.paging[0] , {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
        this.tableData = res.data.userMsts
        this.total_page = res.data.total_page * 10;
      })
      .catch((error) => {
        this.$message.error('권한이 없습니다. \n로그인 화면으로 넘어갑니다.');
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      })

    },

    escDown(event) {
      if(event.keyCode == 27) {
        if (document.getElementsByClassName("AlterPoP")[0].style.display === '') {
          document.getElementsByClassName("AlterPoP")[0].style.display = 'none';
        } else if (document.getElementsByClassName("RegiPoP")[0].style.display === '') {
          document.getElementsByClassName("RegiPoP")[0].style.display = 'none';
        }
      }
    },

    // 전화번호 검색 정규식
    regexPhonenum() {
      this.paging[0].search_telno = this.paging[0].search_telno
        .replace(/[^0-9]/g, "")
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
        .replace("--", "-");
    },

    handleCurrentChange(current_page) {
      this.paging[0].current_page = current_page;
      this.selectedIdxs = [];
      this.selectedRows = this.arrayFill();
      this.call_axios();
    },

    // props
    setSelectedIdxs(selectedIdxs) {
      this.selectedIdxs = selectedIdxs;
    },
    setPaging(paging) {
      this.paging = paging;
      this.call_axios();
    },
    setContent(data) {
      this.userData = [data];
    },
    setRows(data) {
      this.selectedRows = data
    },

    // 등록창 열기
    showRegiPop() {
      const regiDiv = document.getElementsByClassName("RegiPoP")[0];
      regiDiv.style.display = '';
    },

    // 검색창 초기화
    reset() {
      this.paging[0].search_id = '';
      this.paging[0].search_name = '';
      this.paging[0].search_telno = '';

      this.paging[0].user_name_fg = '',
      this.paging[0].cre_dt_fg = '',
      this.paging[0].udt_dt_fg = '',

      this.call_axios();
    },

    arrayFill() {
      return Array(10).fill(false);
    },

    deleteUsers() {
      this.$axios.post('/user/delete', this.selectedIdxs , {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
        this.call_axios()
        this.selectedRows = this.arrayFill();
      })
      .catch((error) => {
      })
    },

    excelDown() {
      this.$axios.get('/user/excelDown', {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
      })
      .catch((error) => {
      })
    }

  }
}
</script>
