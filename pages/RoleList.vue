<template>
  <div class="container">
    
    <div class="header">
      <h3>그룹 관리</h3>
      <div>
        <el-button @click="choose">Manage</el-button>
        <el-button @click="logout">Logout</el-button>
      </div>
    </div>

    <el-form :model="paging[0]" @submit.native.prevent="call_axios">
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
            <el-button type="primary" native-type="call_axios">검색</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="btns">
      <el-button v-if="selectedIdxs.length > 0" @click="deleteRoles">삭제</el-button>
      <el-button @click="showRegiPop">등록</el-button>
      <el-button @click="excelDown">Excel 다운로드</el-button>
    </div>

    <div class="components">
      <RoleTable 
      :ref="asd"
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
      <RoleRegister ref="RoleRegister"/>
    </div>

    <div class="AlterPoP" style="display: none;">
      <RoleAlter :roleData="roleData" ref="RoleAlter"/>
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
    this.call_axios();
    this.selectedRows = this.arrayFill();
    window.addEventListener('keydown', this.escDown);
  },

  methods: {

    ...mapActions(['logout']),

    choose() {
      window.location.href = './choose'
    },

    async call_axios() {

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
        if (document.getElementsByClassName("AlterPoP")[0].style.display === '') {
          this.$refs.RoleAlter.close();
        } else if (document.getElementsByClassName("RegiPoP")[0].style.display === '') {
          this.$refs.RoleRegister.close();
        }
      }
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

      this.call_axios();
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
        this.call_axios()
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
