<template>
    <div>
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
                        <el-input placeholder="ID" v-model="register.user_id">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">이름</span>
                        <el-input placeholder="이름" v-model="register.user_name">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">비밀번호</span>
                        <el-input placeholder="비밀번호" v-model="register.user_password">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">비밀번호 확인</span>
                        <el-input placeholder="비밀번호 확인" v-model="register.user_password_chk">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">전화번호</span>
                        <el-input 
                            placeholder="전화번호" 
                            v-model="register.user_telno" 
                            @input="regexPhonenum"
                        ></el-input>
                    </div>
                    <div>
                        <span class="input-label">유효기간</span>
                        <el-input placeholder="유효기간" v-model="register.user_name">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">카드번호</span>
                        <el-input placeholder="카드번호" v-model="register.user_id">
                        </el-input>
                    </div>
                    <div>
                        <span class="input-label">카드 유효기간</span>
                        <el-input placeholder="카드 유효기간" v-model="register.user_name">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>
                        <span class="input-label">역할</span>
                        <el-input placeholder="역할" v-model="register.user_name">
                        </el-input>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button @click="close">취소</el-button>
            <el-button type="primary" native-type="search">저장</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            register: {
                user_id: '',
                user_name: '',
                user_password: '',
                user_password_chk: '',
                user_telno: '',
                card_exp_dt: '',
                card_id: '',
            }
        }
    },

    methods: {
        close() {
            const regiDiv = document.getElementsByClassName("RegiPoP")[0];
            regiDiv.style.display = 'none';
        },

        regexPhonenum() {
            this.register.user_telno = this.register.user_telno
                .replace(/[^0-9]/g, "")
                .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
                .replace("--", "-");
        },
    }
}
</script>