<template>
    <el-form class="PoPForm" :model="register" @submit.native.prevent="regi_user">
        <div class="header">
            <div>
                <h3>사용자 등록</h3>
            </div>
            <div class="pointer" @click="close"><i class="el-icon-close"></i></div>
        </div>
        <div class="body">
            <div class="form">
                <div>
                    <div>
                        <div>
                            <span class="input-label">ID</span>
                            <el-input placeholder="ID" v-model="register.ettUserMst.user_id"/>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span class="input-label">이름</span>
                            <el-input placeholder="이름" v-model="register.ettUserMst.user_name"/>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <span class="input-label">비밀번호</span>
                            <el-input 
                                placeholder="비밀번호" 
                                v-model="register.ettUserPwd.user_pwd"
                                type="password" 
                            ></el-input>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span class="input-label">비밀번호 확인</span>
                            <el-input 
                                placeholder="비밀번호 확인" 
                                v-model="register.ettUserPwd.user_pwd_chk"
                                type="password" 
                            ></el-input>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <span class="input-label">전화번호</span>
                            <el-input 
                                placeholder="전화번호" 
                                v-model="register.ettUserMst.user_telno" 
                                @input="regexPhonenum"
                            ></el-input>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span class="input-label">유효기간</span>
                            <el-date-picker
                                v-model="register.ettUserMst.acct_exp_dt"
                                type="datetime"
                                placeholder="계정 유효기간">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <span class="input-label">카드번호</span>
                            <el-input placeholder="카드번호" v-model="register.ettUserMst.card_id">
                            </el-input>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span class="input-label">카드 유효기간</span>
                            <el-date-picker
                                v-model="register.ettUserMst.card_exp_dt"
                                type="datetime"
                                placeholder="카드 유효기간">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <span class="input-label">역할</span>
                            <el-select v-model="register.ettUserRoleGrpMap.role_grp_seq" placeholder="Select">
                                <el-option
                                    v-for="item in role_grp"
                                    :key="item.role_grp_seq"
                                    :label="item.role_grp_name"
                                    :value="item.role_grp_seq">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">취소</el-button>
            <el-button type="primary" native-type="regi_user">저장</el-button>
        </div>
    </el-form>
</template>

<script>
import moment from 'moment';
import { getCookie } from '@/utils/cookie'

export default {
    data() {
        return {
            register: {
                ettUserMst : {
                    user_id: '',
                    user_name: '',
                    user_telno: '',
                    acct_exp_dt: '',
                    card_id: '',
                    card_exp_dt: '',
                },
                ettUserPwd : {
                    user_pwd: '',
                    user_pwd_chk: '',
                },
                ettUserRoleGrpMap : {
                    role_grp_seq: ''
                }
            },
            role_grp : []
        }
    },

    mounted() {
        this.$axios.defaults.headers.common['accesstoken'] = getCookie('token');
        this.callRoleGrp()
    },

    methods: {
        close() {
            this.register.ettUserMst = {
                user_id: '',
                user_name: '',
                user_telno: '',
                acct_exp_dt: '',
                card_id: '',
                card_exp_dt: '',
            },
            this.register.ettUserPwd = {
                user_pwd: '',
                user_pwd_chk: '',
            },
            this.register.ettUserRoleGrpMap = {
                role_grp_seq: ''
            }

            const regiDiv = document.getElementsByClassName("RegiPoP")[0];
            regiDiv.style.display = 'none';
        },

        regexPhonenum() {
            this.register.ettUserMst.user_telno = this.register.ettUserMst.user_telno
                .replace(/[^0-9]/g, "")
                .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
                .replace("--", "-");
        },

        async regi_user() {

            this.register.ettUserMst.acct_exp_dt = moment.utc(this.register.ettUserMst.acct_exp_dt).utcOffset(9).format('YYYY-MM-DD HH:mm:ss')
            this.register.ettUserMst.card_exp_dt = moment.utc(this.register.ettUserMst.card_exp_dt).utcOffset(9).format('YYYY-MM-DD HH:mm:ss')

            if ( this.register.ettUserPwd.user_pwd !=  this.register.ettUserPwd.user_pwd_chk) {
                return
            }


            await this.$axios.post('/user/register', this.register)
            .then((res) => {
                const regiDiv = document.getElementsByClassName("RegiPoP")[0];
                regiDiv.style.display = 'none';
                this.$message.success(res.data);
                this.$parent.call_axios();
            })
            .catch((err) => {
                console.log(err);
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