<template>
    <el-form class="regiForm" :model="register" @submit.native.prevent="regi_user">
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
                        <span class="input-label">ID</span>
                        <el-input placeholder="ID" v-model="register.userMst.user_id">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">이름</span>
                        <el-input placeholder="이름" v-model="register.userMst.user_name">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">비밀번호</span>
                        <el-input placeholder="비밀번호" v-model="register.userPwd.user_pwd">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">비밀번호 확인</span>
                        <el-input placeholder="비밀번호 확인" v-model="register.userPwd.user_pwd_chk">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">전화번호</span>
                        <el-input 
                            placeholder="전화번호" 
                            v-model="register.userMst.user_telno" 
                            @input="regexPhonenum"
                        ></el-input>
                    </div>
                    <div>
                        <span class="input-label">유효기간</span>
                        <el-date-picker
                            v-model="register.userMst.acct_exp_dt"
                            type="datetime"
                            placeholder="계정 유효기간">
                        </el-date-picker>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">카드번호</span>
                        <el-input placeholder="카드번호" v-model="register.userMst.card_id">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">카드 유효기간</span>
                        <el-date-picker
                            v-model="register.userMst.card_exp_dt"
                            type="datetime"
                            placeholder="카드 유효기간">
                        </el-date-picker>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">역할</span>
                        <el-select v-model="register.commRoleGrp.role_grp_name" placeholder="Select">
                            <el-option
                                v-for="item in role_grp"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
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

export default {
    data() {
        return {
            register: {
                userMst : {
                    user_id: '',
                    user_name: '',
                    user_telno: '',
                    acct_exp_dt: '',
                    card_id: '',
                    card_exp_dt: '',
                },
                userPwd : {
                    user_pwd: '',
                    user_pwd_chk: '',
                },
                commRoleGrp : {
                    role_grp_name: ''
                } 
            },
            role_grp : [{
                value: '구역관리자',
                label: '구역관리자'
            }, {
                value: '센터관리자',
                label: '센터관리자'
            }, {
                value: '전사관리자',
                label: '전사관리자'
            }]
        }
    },

    methods: {
        close() {
            const regiDiv = document.getElementsByClassName("RegiPoP")[0];
            regiDiv.style.display = 'none';
        },

        regexPhonenum() {
            this.register.userMst.user_telno = this.register.userMst.user_telno
                .replace(/[^0-9]/g, "")
                .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
                .replace("--", "-");
        },

        async regi_user() {

            this.register.userMst.acct_exp_dt = moment.utc(this.register.userMst.acct_exp_dt).utcOffset(9).format('YYYY-MM-DD HH:mm:ss')
            this.register.userMst.card_exp_dt = moment.utc(this.register.userMst.card_exp_dt).utcOffset(9).format('YYYY-MM-DD HH:mm:ss')

            console.log(this.register)

            await this.$axios.post('/user/register', this.register)
            .then((res) => {

            })
            .catch((err) => {
                console.error(err);
            })
        }
    }
}
</script>