<template>
    <el-form class="PoPForm" :model="alter" @submit.native.prevent="alter_role">
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
                        <div>
                            <span class="input-label">그룹명</span>
                            <el-input placeholder="그룹명" v-model="alter.ettRoleGrp.role_grp_name"></el-input>
                        </div>
                        <p v-show="valid.ettRoleGrp.role_grp_name">필수 항목입니다.</p>
                    </div>
                    <div>
                        <div>
                            <span class="input-label">그룹설명</span>
                            <el-input placeholder="그룹설명" v-model="alter.ettRoleGrp.role_grp_desc"></el-input>
                        </div>
                        <p v-show="valid.ettRoleGrp.role_grp_desc">필수 항목입니다.</p>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <span class="input-label">상태코드</span>
                            <el-input placeholder="상태코드" v-model="alter.ettRoleGrp.stat_cd"></el-input>
                        </div>
                        <p v-show="valid.ettRoleGrp.stat_cd">2자리의 숫자나 영문자만 입력 가능합니다.</p>
                    </div>
                    <div>
                        <div>
                            <span class="input-label">추가 권한 여부</span>
                            <el-input placeholder="추가 권한 여부" v-model="alter.ettRoleGrp.hv_acc_role_yn"></el-input>
                        </div>
                        <p v-show="valid.ettRoleGrp.hv_acc_role_yn">Y or N만 입력 가능합니다.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">취소</el-button>
            <el-button type="primary" native-type="alter_role">저장</el-button>
        </div>
    </el-form>
</template>

<script>
import * as validationUtils from '@/utils/validation'
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
            valid: {
                ettRoleGrp : {
                    role_grp_name: false,
                    role_grp_desc: false,
                    stat_cd: false,
                    hv_acc_role_yn: false,
                },
            },
            role_grp : []
        }
    },

    mounted() {
        this.$axios.defaults.headers.common['accesstoken'] = getCookie('token');
    },

    watch: {
        roleData: function (val) {
            this.alter.ettRoleGrp = Object.assign({}, val[0]);
        },
        'alter.ettRoleGrp.role_grp_name' : function (val) {
            this.valid.ettRoleGrp.role_grp_name = !validationUtils.require(val);
        },
        'alter.ettRoleGrp.role_grp_desc' : function (val) {
            this.valid.ettRoleGrp.role_grp_desc = !validationUtils.require(val);
        },
        'alter.ettRoleGrp.stat_cd' : function (val) {
            this.valid.ettRoleGrp.stat_cd = !validationUtils.checkCd(val);
        },
        'alter.ettRoleGrp.hv_acc_role_yn' : function (val) {
            this.valid.ettRoleGrp.hv_acc_role_yn = !validationUtils.checkYN(val);
        },
    },

    methods: {

        close() {
            this.valid.ettRoleGrp = { 
                role_grp_name: false,
                role_grp_desc: false,
                stat_cd: false,
                hv_acc_role_yn: false, 
            };

            const alterDiv = document.getElementsByClassName("AlterPoP")[0];
            alterDiv.style.display = 'none';
        },

        async alter_role() {

            const vld = this.valid.ettRoleGrp;
            
            if( !(vld.role_grp_name && vld.role_grp_desc && vld.stat_cd && vld.hv_acc_role_yn) ) {

                await this.$axios.post('/role/alter', this.alter)
                .then((res) => {
                    const alterDiv = document.getElementsByClassName("AlterPoP")[0];
                    alterDiv.style.display = 'none';
                    this.$message.success(res.data);
                    this.$parent.call_axios();
                })
                .catch((err) => {
                    console.log(err.response.status);
                    this.$message.error(err.response.data);
                })
            } else {
                for (var i in vld) {
                    if(this.alter.ettRoleGrp[i].length == 0) {
                        vld[i] = true;
                    }
                }
                this.$message.error("입력 조건을 확인해주세요.");
            }
        },

    }
}
</script>