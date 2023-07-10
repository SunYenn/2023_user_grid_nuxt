<template>
    <el-form class="PoPForm" :model="alter" @submit.native.prevent="alter_user">
        <div class="header">
            <div>
                <h3>그룹 정보 수정</h3>
            </div>
            <div class="pointer" @click="close"><i class="el-icon-close"></i></div>
        </div>
        <div class="body">
            <div class="form">
                <div>
                    <div>
                        <span class="input-label">그룹명</span>
                        <el-input placeholder="그룹명" v-model="alter.ettRoleGrp.role_grp_name">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">그룹설명</span>
                        <el-input placeholder="그룹설명" v-model="alter.ettRoleGrp.role_grp_desc">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">상태코드</span>
                        <el-input placeholder="상태코드" v-model="alter.ettRoleGrp.stat_cd">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">추가 권한 여부</span>
                        <el-input placeholder="추가 권한 여부" v-model="alter.ettRoleGrp.hv_acc_role_yn">
                        </el-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">취소</el-button>
            <el-button type="primary" native-type="alter_user">저장</el-button>
        </div>
    </el-form>
</template>

<script>
import moment from 'moment';
import { getCookie } from '@/utils/cookie'

export default {

    props: {
        roleData: {
        type: Array,
        default: () => [],
        },
    },

    data() {
        return {
            alter: {
                ettRoleGrp : {
                    role_grp_seq: '',
                    role_grp_name: '',
                    role_grp_desc: '',
                    stat_cd: '',
                    hv_acc_role_yn: '',
                },
            },
            role_grp : []
        }
    },

    mounted() {
        this.$axios.defaults.headers.common['accesstoken'] = getCookie('token');
        this.callRoleGrp()
    },

    watch: {
        roleData: function (val) {
            this.alter.ettRoleGrp = Object.assign({}, val[0]);
        },
    },

    methods: {

        close() {
            const alterDiv = document.getElementsByClassName("AlterPoP")[0];
            alterDiv.style.display = 'none';
        },

        async alter_user() {

            await this.$axios.post('/role/alter', this.alter)
            .then((res) => {
                const alterDiv = document.getElementsByClassName("AlterPoP")[0];
                alterDiv.style.display = 'none';
                this.$message.success(res.data);
            })
            .catch((err) => {
                console.log(err.response.status);
                this.$message.error(err.response.data);
            })
        },

        callRoleGrp() {
            this.$axios.get('/user/roleList')
            .then((res) => {
                this.role_grp = res.data;
            })
            .catch((err) => {
                console.error(err);
            })
        },

    }
}
</script>