<template>
    <el-form class="PoPForm" :model="register" @submit.native.prevent="regi_role">
        <div class="header">
            <div>
                <h3>그룹 등록</h3>
            </div>
            <div class="pointer" @click="close"><i class="el-icon-close"></i></div>
        </div>
        <div class="body">
            <div class="form">
                <div>
                    <div>
                        <span class="input-label">그룹명</span>
                        <el-input placeholder="그룹명" v-model="register.ettRoleGrp.role_grp_name">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">그룹 설명</span>
                        <el-input placeholder="그룹설명" v-model="register.ettRoleGrp.role_grp_desc">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">상태코드</span>
                        <el-input 
                            placeholder="상태코드" 
                            v-model="register.ettRoleGrp.stat_cd"
                        ></el-input>
                    </div>
                    <div>
                        <span class="input-label">추가 권한 여부</span>
                        <el-input 
                            placeholder="Y or N" 
                            v-model="register.ettRoleGrp.hv_acc_role_yn"
                        ></el-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">취소</el-button>
            <el-button type="primary" native-type="regi_role">저장</el-button>
        </div>
    </el-form>
</template>

<script>
import { getCookie } from '@/utils/cookie'

export default {
    data() {
        return {
            register: {
                ettRoleGrp : {
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
    },

    methods: {
        close() {
            this.register.ettRoleGrp = { 
                role_grp_name: '',
                role_grp_desc: '',
                stat_cd: '',
                hv_acc_role_yn: '', 
            };
            const regiDiv = document.getElementsByClassName("RegiPoP")[0];
            regiDiv.style.display = 'none';

        },

        async regi_role() {

            await this.$axios.post('/role/register', this.register)
            .then((res) => {
                const regiDiv = document.getElementsByClassName("RegiPoP")[0];
                regiDiv.style.display = 'none';
                this.$message.success(res.data);
            })
            .catch((err) => {
                console.log(err);
                this.$message.error(err.response.data);
            })
        },

    }
}
</script>