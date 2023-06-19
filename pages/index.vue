<template>
  <div class="container">

    <div class="header">
      <h3>사용자 관리</h3>
    </div>

    <el-form :model="search" @submit.native.prevent="search">
      <div class="search">
        <div>
          <div class="search_div">
            <span class="input-label">ID</span>
            <el-input
              placeholder="ID"
              v-model="search.id">
            </el-input>
          </div>
          <div class="search_div">
            <span class="input-label">이름</span>
            <el-input
              placeholder="이름"
              v-model="search.name">
            </el-input>
          </div>
          <div class="search_div">
            <span class="input-label">전화번호</span>
            <el-input
              placeholder="전화번호"
              v-model="search.phonenum"
              @input="regexPhonenum()">
            </el-input>
          </div>
          <div class="search_div">
            <el-button>초기화</el-button>
            <el-button type="primary">검색</el-button>
          </div>
        </div>
      </div>
    </el-form>

    <div class="btns">
      <el-button v-if="selectedIdxs.length > 0" @click="test">삭제</el-button>
      <el-button>등록</el-button>
      <el-button>일괄등록</el-button>
      <el-button>Excel 다운로드</el-button>
    </div>

    <div class="components">
      <Table :selectedIdxs="selectedIdxs" :order="order" @select="setSelectedIdxs" @setOrder="setOrder"/>
    </div>

    <div class="footer">
      <el-select v-model="search.page_size" style="width: 100px;" @change="chg_pagesize">
          <el-option label="5" value="5" align="center"></el-option>
          <el-option label="7" value="7" align="center"></el-option>
          <el-option label="10" value="10" align="center"></el-option>
      </el-select>
      <el-pagination background layout="prev, pager, next" 
        @current-change="handleCurrentChange"
        :current-page="current_page" :total="total_page">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import Table from '@/components/Table.vue';
import axios from 'axios'

export default {
  components: {
    Table // Table 컴포넌트 등록
  },

  data() {
    return {
      userData : [],
      total_page : 100,
      current_page : 1,
      search : {
        page_size: 10,
        id: '',
        name: '',
        phonenum: '',
      },
      order : [{
        user_name: 'asc',
        cre_dt: 'asc',
        udt_dt: 'asc'
      }],
      selectedIdxs: []
    }
  },

  mounted() {
    this.call_axios();
  },

  methods: {
    call_axios() {
      axios({
        method: 'post',
        url: 'http://localhost:8080/api/user/list',
        data: {
          search : this.search, 
          order : this.order
        }
      }).then((response) => {
        // this.$message.success('유저');
        // setTimeout(() => {
        //   window.location.href = this.$store.getters.getFrontURL + 'boardList';
        // }, 500);
      }).catch((error) => {
        console.error(error);
        this.$message.error('유저정보를 가져오는데 실패했습니다.');
      })
    },

    // 전화번호 검색 정규식
    regexPhonenum() {
      this.search.phonenum = this.search.phonenum.replace(/[^0-9]/g, "")
									                               .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,"$1-$2-$3").replace("--", "-");
    },
    chg_pagesize() {
      
    },
    handleCurrentChange() {

    },

    // props
    setSelectedIdxs(selectedIdxs) {
      this.selectedIdxs = selectedIdxs;
    },
    setOrder(order) {
      this.order = order;
      console.log(JSON.stringify(this.order[0]));
    }

  }
}
</script>
