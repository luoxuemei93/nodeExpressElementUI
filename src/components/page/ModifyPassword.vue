<template>
	<div>
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="userContent">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item prop="pass" label="密码">
					<el-input v-model="form.pass" type="password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item prop="checkPass" label="确认密码">
					<el-input v-model="form.checkPass" type="password" placeholder="请再次输入密码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit('form')">确定</el-button>
					<el-button @click="onCancle()">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
    import Vue from 'vue';

	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else {
					if(this.form.checkPass !== '') {
						this.$refs.form.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.form.pass) {
					callback(new Error('两次输入的密码不一致'));
				} else {
					callback();
				}
			};
            return {
				form: {pass: '', checkPass: ''},
				rules: {
					pass: [{ validator: validatePass, trigger: 'blur'}],
                    checkPass: [{ validator: validatePass2, trigger: 'blur' }]
				}
			}
        },
        methods:{
        	onSubmit(formName) {
				const self = this;
				let formData = {
					userName: parseInt(sessionStorage.getItem('ms_usernatme')),
					pass: self.form.pass,
					checkPass: self.form.checkPass
				};
				self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('/api/user/modifyPassword',formData).then(function(rsp) {
                            if(rsp.data.status == '200'){
                                self.$notify({title: '成功', message: rsp.data.msg, type: 'success', duration: 3000});
                                self.$router.push('/login');
                            } else {
                                self.$notify({title: '失败', message: "修改失败，请重新登录", type: 'warning', duration: 3000});
                            }
						}).then(function(error) {
							console.log(error);
						})
                    } else {
                        return false;
                    }
                });
        	},
        	onCancle() {
        		this.$router.push('/userCenter');
        	}
        }
	}
</script>

<style>
	.userContent {
		width: 400px;
		margin: 0 auto;
	}
</style>
