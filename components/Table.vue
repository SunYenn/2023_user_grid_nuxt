<template>
  <el-table class="grid" :data="tableData">

    <el-table-column min-width="20">
      <template slot="header">
        <el-checkbox
          @change="handleSelectAll"
        ></el-checkbox>
      </template>
      <template slot-scope="scope">
        <el-checkbox
          v-model="selectedRows[scope.$index]"
          @change="handleSelectionChange(scope.$index)"
        ></el-checkbox>
      </template>
    </el-table-column>

    <el-table-column prop="user_seq" label="NO" min-width="30"></el-table-column>

    <el-table-column label="이름">
      <template slot="header">
        <div>
          <span>이름</span>
          <i class="el-icon-d-caret pointer" @click="toggleOrder('user_name_fg')"></i>
        </div>
      </template>
      <template slot-scope="scope">
        <span class="pointer" @click="showAlterPop1(scope.row)">{{ scope.row.user_name }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="user_id" label="ID">
      <template slot-scope="scope">
        <span class="pointer" @click="showAlterPop2(scope.row.user_id)">{{ scope.row.user_id }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="role_grp_name" label="역할"></el-table-column>

    <el-table-column prop="cre_id" label="등록자">
      <template slot-scope="scope">
        <span class="pointer" @click="showAlterPop2(scope.row.cre_id)">{{ scope.row.cre_id }}</span>
      </template>
    </el-table-column>

    <el-table-column label="등록일시" min-width="150" >
      <template slot="header">
        <div>
          <span>등록일시</span>
          <i class="el-icon-d-caret pointer" @click="toggleOrder('cre_dt_fg')"></i>
        </div>
      </template>
      <template slot-scope="scope">
        {{ scope.row.cre_dt }}
      </template>
    </el-table-column>

    <el-table-column prop="udt_id" label="수정자">
      <template slot-scope="scope">
        <span class="pointer" @click="showAlterPop2(scope.row.udt_id)">{{ scope.row.udt_id }}</span>
      </template>
    </el-table-column>

    <el-table-column label="수정일시" min-width="150">
      <template slot="header">
        <div>
          <span>수정일시</span>
          <i class="el-icon-d-caret pointer" @click="toggleOrder('udt_dt_fg')"></i>
        </div>
      </template>
      <template slot-scope="scope">
        {{ scope.row.udt_dt }}
      </template>
    </el-table-column>

  </el-table>
</template>
    
<script>
import { getCookie } from '@/utils/cookie'

export default {

  props: {
    selectedIdxs: {
      type: Array,
      default: () => [],
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    paging: {
      type: Array,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    }
  },

  data() {
    return {
      selectAll: false,
      localSelectedRows: [],

      orderFlag: {
        user_name_fg : true,
        cre_dt_fg : true,
        udt_dt_Fg : true
      },
    }
  },



  methods: {

    // 체크박스 기능
    handleSelectAll(checked) {

      if (checked) {
        this.localSelectedRows = this.tableData.map(() => true);
      } else {
        this.localSelectedRows = this.tableData.map(() => false);
      }

      this.$emit('setRows', this.localSelectedRows);
    },

    handleSelectionChange(index) {

      let arr = this.selectedIdxs;
      if (this.selectedRows[index]) {
        arr.push(this.tableData[index].user_seq);
      } else {
        for(let i = 0; i < arr.length; i++) {
          if(arr[i] === this.tableData[index].user_seq)  {
            arr.splice(i, 1);
            i--;
          }
        }
      }
      this.$emit('select', arr);
      this.$emit('setRows', this.selectedRows);
    },

    // 정렬 기능
    toggleOrder(field) {
      this.orderFlag[field] = !this.orderFlag[field];
      this.paging[0][field] = this.orderFlag[field] == true ? 'asc' : 'desc';
      this.$emit('setPaging', this.paging);
    },

    showAlterPop1(data) {
      const regiDiv = document.getElementsByClassName("AlterPoP")[0];
      regiDiv.style.display = '';
      this.$emit('altercontent', data);
    },

    showAlterPop2(data) {
      const regiDiv = document.getElementsByClassName("AlterPoP")[0];
      regiDiv.style.display = '';
      this.$axios.get('/user/getUserData/' + data , {
        headers : {
          'accesstoken': getCookie('token'),
        }
      })
      .then((res) => {
        this.$emit('altercontent', res.data);
      })
      .catch((error) => {
        this.$message.error("사용자 정보를 불러오는데 실패했습니다.")
      })
    }
  },

}
  
</script>