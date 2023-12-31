<template>
  <div class="container">
    
    <div class="header">
      <h3>그룹 관리</h3>
      <div>
        <el-button @click="choose">Manage</el-button>
        <el-button @click="logout">Logout</el-button>
      </div>
    </div>

    <el-form :model="paging[0]" @submit.native.prevent="init">
      <div class="search">
        <div>
          <div class="search_div">
            <span class="input-label">그룹명</span>
            <el-input placeholder="그룹명" v-model="paging[0].search_name">
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
      <el-button v-if="selectedIdxs.length > 0" @click="deleteRoles">삭제</el-button>
      <el-button @click="modal('register' , true)">등록</el-button>
      <el-button @click="excelDown">Excel 다운로드</el-button>
    </div>

    <div class="components">
      <RoleTable 
      :ref="asd"
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
        <el-pagination 
          background layout="prev, pager, next" 
          @current-change="handleCurrentChange"
          :current-page="paging[0].current_page" 
          :total="total_page"
        >
        </el-pagination>
    </div>

    <div>
      <RoleRegister 
        ref="RoleRegister"
        v-show="openModal.register" 
        @ctrlModal="modal"
      />
    </div>

    <div>
      <RoleAlter 
        :roleData="roleData" 
        ref="RoleAlter"
        v-show="openModal.alter" 
        @ctrlModal="modal"
      />
    </div>

  </div>
</template>

<script>
import RoleTable from '@/components/RoleTable.vue';
import RoleRegister from '@/components/RoleRegister.vue';
import RoleAlter from '@/components/RoleAlter.vue';
import { mapActions } from 'vuex';
import { getCookie } from '@/utils/cookie'
import { excelDown } from '@/utils/getExcel'

export default {

  data() {
    return {
      tableData: [],
      total_page: 0,

      openModal: {
        register : false,
        alter : false
      },
      
      paging : [{
        page_size: 10, 
        current_page: 1,

        role_name_fg: '',
        cre_dt_fg: '',
        udt_dt_fg: '',

        search_name : '',

      }],
      selectedIdxs: [],
      selectedRows: [],
      roleData: []
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

      await this.$axios.post('/role/list', this.paging[0] , {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
        this.tableData = res.data.roleGrps
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
      if(event.keyCode == 27) {
        if (this.openModal.alter) {
          this.$refs.RoleAlter.close();
        } else if (this.openModal.register) {
          this.$refs.RoleRegister.close();
        }
      }
    },

    // 팝업창 열고 닫기
    modal(pop, data) {
      this.openModal[pop] = data;
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
      this.roleData = [data];
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
      this.paging[0].search_name = '';

      this.paging[0].role_name_fg = '',
      this.paging[0].cre_dt_fg = '',
      this.paging[0].udt_dt_fg = '',

      this.init();
    },

    arrayFill() {
      return Array(10).fill(false);
    },

    deleteRoles() {
      this.$axios.post('/role/delete', this.selectedIdxs , {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
        this.init()
        this.selectedRows = this.arrayFill();
      })
      .catch((error) => {
        this.$message.error('그룹 정보 삭제에 실패했습니다.');
      })
    },

    excelDown() {
      this.$axios.get('/role/excelDown', {
        headers : {
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
