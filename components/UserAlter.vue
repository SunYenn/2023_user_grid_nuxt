<template>
    <el-form class="PoPForm" :model="alter" @submit.native.prevent="alter_user">
        <div class="header">
            <div>
                <h3>사용자 정보 수정</h3>
            </div>
            <div class="pointer" @click="close"><i class="el-icon-close"></i></div>
        </div>
        <div class="body">
            <div class="form">
                <div>
                    <div>
                        <span class="input-label">이름</span>
                        <el-input placeholder="이름" v-model="alter.ettUserMst.user_name">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">사원번호</span>
                        <el-input placeholder="사원번호" v-model="alter.ettUserMst.user_sno">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">이메일</span>
                        <el-input placeholder="이메일" v-model="alter.ettUserMst.user_email">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">역할</span>
                        <el-select v-model="alter.ettUserMst.role_grp_name" placeholder="Select">
                            <el-option
                                v-for="item in role_grp"
                                :key="item.role_grp_seq"
                                :label="item.role_grp_name"
                                :value="item.role_grp_seq">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">전화번호</span>
                        <el-input 
                            placeholder="전화번호" 
                            v-model="alter.ettUserMst.user_telno" 
                            @input="regexPhonenum"
                        ></el-input>
                    </div>
                    <div>
                        <span class="input-label">유효기간</span>
                        <el-date-picker
                            v-model="alter.ettUserMst.acct_exp_dt"
                            type="datetime"
                            placeholder="계정 유효기간">
                        </el-date-picker>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">카드번호</span>
                        <el-input placeholder="카드번호" v-model="alter.ettUserMst.card_id">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">카드 유효기간</span>
                        <el-date-picker
                            v-model="alter.ettUserMst.card_exp_dt"
                            type="datetime"
                            placeholder="카드 유효기간">
                        </el-date-picker>
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
        userData: {
        type: Array,
        default: () => [],
        },
    },

    data() {
        return {
            alter: {
                ettUserMst : {
                    user_name: '',
                    user_sno: '',
                    user_email: '',
                    user_telno: '',
                    acct_exp_dt: '',
                    card_id: '',
                    card_exp_dt: '',
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

    watch: {
        userData: function (val) {
            // userData에 대해 직접적인 참조가 아닌 독립적인 참조를 하도록 복사하여 사용
            this.alter.ettUserMst = Object.assign({}, val[0]);
        },
    },

    methods: {

        close() {
            const alterDiv = document.getElementsByClassName("AlterPoP")[0];
            alterDiv.style.display = 'none';
        },

        regexPhonenum() {
            this.alter.ettUserMst.user_telno = this.alter.ettUserMst.user_telno
                .replace(/[^0-9]/g, "")
                .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
                .replace("--", "-");
        },

        async alter_user() {

            this.alter.ettUserMst.acct_exp_dt = moment.utc(this.alter.ettUserMst.acct_exp_dt).utcOffset(9).format('YYYY-MM-DD HH:mm:ss')
            this.alter.ettUserMst.card_exp_dt = moment.utc(this.alter.ettUserMst.card_exp_dt).utcOffset(9).format('YYYY-MM-DD HH:mm:ss')

            await this.$axios.post('/user/alter', this.alter)
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