<template>
  <div class="container">

    <div class="header">
      <h3>사용자 관리</h3>
      <div>
        <el-button @click="choose">Manage</el-button>
        <el-button @click="logout">Logout</el-button>
      </div>
    </div>

    <el-form :model="paging[0]" @submit.native.prevent="init">
      <div class="search">
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
        </div>
        <div>
          <div class="search_div">
            <el-button @click="reset">초기화</el-button>
            <el-button type="primary" native-type="init">검색</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="btns">
      <el-button v-if="selectedIdxs.length > 0" @click="deleteUsers">삭제</el-button>
      <el-button @click="modal('register' , true)">등록</el-button>
      <el-button @click="excelDown">Excel 다운로드</el-button>
    </div>

    <div class="components">
      <UserTable 
        :selectedIdxs="selectedIdxs" 
        :paging="paging" 
        :tableData="tableData" 
        :selectedRows="selectedRows"
        @select="setSelectedIdxs" 
        @setPaging="setPaging" 
        @altercontent="setContent" 
        @setRows="setRows" 
        @ctrlModal="modal"
      />
    </div>

    <div class="footer paging">
      <el-select v-model="paging[0].page_size" style="width: 100px;" @change="init">
        <el-option v-for="option in [5, 7, 10]" :key="option" :label="option" :value="option" align="center"></el-option>
      </el-select>
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
        :current-page="paging[0].current_page" :total="total_page">
      </el-pagination>
    </div>

    <div>
      <UserRegister 
        ref="UserRegister" 
        v-show="openModal.register" 
        @ctrlModal="modal"
      />
    </div>

    <div>
      <UserAlter 
        :userData="userData" 
        ref="UserAlter" 
        v-show="openModal.alter" 
        @ctrlModal="modal"
      />
    </div>

  </div>
</template>

<script>
import UserTable from '@/components/UserTable.vue';
import UserRegister from '@/components/UserRegister.vue';
import UserAlter from '@/components/UserAlter.vue';
import { mapActions } from 'vuex';
import { excelDown } from '@/utils/getExcel'
import { getCookie } from '@/utils/cookie'

export default {

  data() {
    return {
      tableData: [],
      total_page: 0,

      openModal: {
        register : false,
        alter : false
      },

      paging: [{
        page_size: 10,
        current_page: 1,

        user_name_fg: '',
        cre_dt_fg: '',
        udt_dt_fg: '',

        search_id: '',
        search_name: '',
        search_telno: ''
      }],
      selectedIdxs: [],
      selectedRows: [],
      userData: []
    }
  },

  mounted() {
    this.init();
    this.selectedRows = this.arrayFill();
    window.addEventListener('keydown', this.escDown);
  },

  methods: {

    ...mapActions(['logout']),

    choose() {
      window.location.href = './choose'
    },

    async init() {

      await this.$axios.post('/user/list', this.paging[0], {
        headers: {
          'accesstoken': getCookie('token'),
        }
      })
        .then((res) => {
          this.tableData = res.data.userMsts
          this.total_page = res.data.total_page * 10;
        })
        .catch((error) => {
          this.$message.error('권한이 없습니다. \n선택 화면으로 넘어갑니다.');
          setTimeout(() => {
            window.location.href = "./choose";
          }, 500);
        })

    },

    escDown(event) {
      if (event.keyCode == 27) {
        if (this.openModal.alter) {
          this.$refs.UserAlter.close();
        } else if (this.openModal.register) {
          this.$refs.UserRegister.close();
        }
      }
    },
    
    // 팝업창 열고 닫기
    modal(pop, data) {
      this.openModal[pop] = data;
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
      this.init();
    },

    // props
    setSelectedIdxs(selectedIdxs) {
      this.selectedIdxs = selectedIdxs;
    },
    setPaging(paging) {
      this.paging = paging;
      this.init();
    },
    setContent(data) {
      this.userData = [data];
    },
    setRows(data) {
      this.selectedRows = data
    },

    // 검색창 초기화
    reset() {
      this.paging[0].search_id = '';
      this.paging[0].search_name = '';
      this.paging[0].search_telno = '';

      this.paging[0].user_name_fg = '',
        this.paging[0].cre_dt_fg = '',
        this.paging[0].udt_dt_fg = '',

        this.init();
    },

    arrayFill() {
      return Array(10).fill(false);
    },

    deleteUsers() {

      this.$axios.post('/user/delete', this.selectedIdxs, {
        headers: {
          'accesstoken': getCookie('token'),
        }
      })
        .then((res) => {
          this.init()
          this.selectedRows = this.arrayFill();
        })
        .catch((error) => {
        })
    },

    excelDown() {
      this.$axios.get('/user/excelDown', {
        headers: {
          'accesstoken': getCookie('token'),
        },
        responseType: 'blob'
      })
        .then((res) => {
          excelDown(res);

        })
        .catch((error) => {
          this.$message.error('파일 다운로드에 실패했습니다.');
          console.log(error)
        })
    },

  }
}
</script>
