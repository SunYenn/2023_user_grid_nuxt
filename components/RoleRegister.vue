<template>
    <div class="popBack">
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
                            <div>
                                <span class="input-label">그룹명</span>
                                <el-input placeholder="그룹명" v-model="register.ettRoleGrp.role_grp_name"></el-input>
                            </div>
                            <p v-show="valid.ettRoleGrp.role_grp_name">필수 항목입니다.</p>
                        </div>
                        <div>
                            <div>
                                <span class="input-label">그룹 설명</span>
                                <el-input placeholder="그룹설명" v-model="register.ettRoleGrp.role_grp_desc"></el-input>
                            </div>
                            <p v-show="valid.ettRoleGrp.role_grp_desc">필수 항목입니다.</p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <span class="input-label">상태코드</span>
                                <el-input 
                                    placeholder="상태코드" 
                                    v-model="register.ettRoleGrp.stat_cd"
                                    maxlength="2"
                                ></el-input>
                            </div>
                            <p v-show="valid.ettRoleGrp.stat_cd">2자리의 숫자나 영문자만 입력 가능합니다.</p>
                        </div>
                        <div>
                            <div>
                                <span class="input-label">추가 권한 여부</span>
                                <el-input 
                                    placeholder="Y or N" 
                                    v-model="register.ettRoleGrp.hv_acc_role_yn"
                                    maxlength="1"
                                ></el-input>
                            </div>
                            <p v-show="valid.ettRoleGrp.hv_acc_role_yn">Y or N만 입력 가능합니다.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <el-button @click="close">취소</el-button>
                <el-button type="primary" native-type="regi_role">저장</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getCookie } from '@/utils/cookie'
import * as validationUtils from '@/utils/validation'

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
        'register.ettRoleGrp.role_grp_name' : function (val) {
            this.valid.ettRoleGrp.role_grp_name = !validationUtils.require(val);
        },
        'register.ettRoleGrp.role_grp_desc' : function (val) {
            this.valid.ettRoleGrp.role_grp_desc = !validationUtils.require(val);
        },
        'register.ettRoleGrp.stat_cd' : function (val) {
            this.valid.ettRoleGrp.stat_cd = !validationUtils.checkCd(val);
        },
        'register.ettRoleGrp.hv_acc_role_yn' : function (val) {
            this.valid.ettRoleGrp.hv_acc_role_yn = !validationUtils.checkYN(val);
        },
    },

    methods: {
        close() {
            this.register.ettRoleGrp = {};

            this.valid.ettRoleGrp = { 
                role_grp_name: false,
                role_grp_desc: false,
                stat_cd: false,
                hv_acc_role_yn: false, 
            };

            this.$emit('ctrlModal', "register", false)

        },

        async regi_role() {

            const vld = this.valid.ettRoleGrp;
            
            if(!(vld.role_grp_name && vld.role_grp_desc && vld.stat_cd && vld.hv_acc_role_yn)) {
                await this.$axios.post('/role/register', this.register)
                .then((res) => {
                    this.$emit('ctrlModal', "register", false)
                    this.$message.success(res.data);
                    this.$parent.call_axios();
                })
                .catch((err) => {
                    console.log(err);
                    this.$message.error(err.response.data);
                })
            } else {
                for (var i in vld) {
                    if(this.register.ettRoleGrp[i].length == 0) {
                        vld[i] = true;
                    }
                }
                this.$message.error("입력 조건을 확인해주세요.");
            }

            
        },

    }
}
</script>