<template>
  <el-table class="grid" :data="tableData">

    <el-table-column min-width="20">
      <template slot="header">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="selectAll"
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
        <span class="pointer">{{ scope.row.user_name }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="user_id" label="ID">
      <template slot-scope="scope">
        <span class="pointer">{{ scope.row.user_id }}</span>
      </template>
    </el-table-column>

    <el-table-column prop="role_grp_name" label="역할"></el-table-column>

    <el-table-column prop="cre_id" label="등록자">
      <template slot-scope="scope">
        <span class="pointer">{{ scope.row.cre_id }}</span>
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
        <span class="pointer">{{ scope.row.udt_id }}</span>
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

export default {

  props: {
    selectedIdxs: {
      type: Array,
      default: () => [],
    },
    order_data: {
      type: Array,
      default: () => [],
    }
  },

  data() {
    return {
      selectAll: false,
      selectedRows:[],
      orderFlag: {
        user_name_fg : true,
        cre_dt_fg : true,
        udt_dt_Fg : true
      },

      tableData: [{
        user_seq : 71,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 72,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 73,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 74,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 75,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 76,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 77,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      },{
        user_seq : 78,
        user_name: '다층 선예은',
        user_id: 'bjoh3',
        role_grp_name : '구역관리자',
        cre_id: 'admin013',
        cre_dt: '2023-06-01 14:19:08',
        udt_id: 'bjoh3',
        udt_dt: '2023-06-01 15:19:08'
      }]
    }
  },

  computed: {
    isIndeterminate() {
      return (
        this.selectedRows.length > 0 &&
        !this.isAllSelected() &&
        !this.isNoneSelected()
      );
    }
  },

  methods: {

    // 체크박스 기능
    handleSelectAll(checked) {
      if (checked) {
        this.selectedRows = this.tableData.map(() => true);
      } else {
        this.selectedRows = [];
      }
    },
    handleSelectionChange(index) {
      this.selectAll = this.isAllSelected();
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
    },
    isAllSelected() {
      return this.selectedRows.length === this.tableData.length;
    },
    isNoneSelected() {
      return this.selectedRows.length === 0;
    },

    // 정렬 기능
    toggleOrder(field) {
      this.orderFlag[field] = !this.orderFlag[field];
      this.order_data[0][field] = this.orderFlag[field] == true ? 'asc' : 'desc';
      this.$emit('setOrder', this.order_data);
    }
  },

}
  
</script>