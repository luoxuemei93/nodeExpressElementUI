<template>
	<div>
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>读者用户添加</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="userContent" style="width:400px">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item prop="id" label="ID">
					<el-input v-model="form.id" placeholder="ID"></el-input>
				</el-form-item>
				<el-form-item prop="date" label="日期">
					<el-col :span="24">
						<el-date-picker type="date" placeholder="选择日期" v-model="form.date" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item prop="name" label="姓名">
					<el-input v-model="form.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item prop="province" label="省份">
					<el-input v-model="form.province" placeholder="省份"></el-input>
				</el-form-item>
				<el-form-item prop="city" label="城市">
					<el-input v-model="form.city" placeholder="城市"></el-input>
				</el-form-item>
				<el-form-item prop="address" label="地址">
					<el-input v-model="form.address" placeholder="地址"></el-input>
				</el-form-item>
				<el-form-item prop="zip" label="邮编">
					<el-input v-model="form.zip" placeholder="邮编"></el-input>
				</el-form-item>
				<el-form-item prop="phone" label="手机">
					<el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item prop="card" label="身份证">
					<el-input v-model="form.card" placeholder="请输入身份证"></el-input>
				</el-form-item>
				<el-form-item prop="email" label="邮箱">
					<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="updateUserData('form')">确定</el-button>
					<el-button @click="onCancle()">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import Util from '../../utils/utils';
	export default {
		data() {
			var validateEmail = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入邮箱'));
				} else if (!Util.emailReg.test(this.form.email)){
					callback(new Error('请输入正确的邮箱'));
				} else {
					callback();
				}
			};
			var validatePhone = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入手机号'));
				} else if (!Util.phoneReg.test(this.form.phone)){
					callback(new Error('请输入正确的手机号'));
				} else {
					callback();
				}
			};
			var validateCard = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入身份证号'));
				} else if (!Util.idCardReg.test(this.form.card)){
					callback(new Error('请输入正确的身份证号'));
				} else {
					callback();
				}
			};
            return {
				form: {
					date: '',
					name: '',					
					email: '',
					phone: '',
					card: '',
					province: '',
					city: '',
					address:'',
					zip:''
					
				},
				rules: {
					date: [
                        { required: true, message: '请输入日期', type: 'date', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, validator: validateEmail, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, validator: validatePhone, trigger: 'blur' }
                    ],
                    card: [
                        { required: true, validator: validateCard, trigger: 'blur' }
                    ],
                    province: [
                        { required: true, message: '请输入省份', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请输入城市', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请输入地址', trigger: 'blur' }
                    ],
                    zip:[
                        { required: true, message: '请输入邮编', trigger: 'blur' }
                    ]
                }
			}
        },
        methods:{	
			updateUserData(formName) {
				const self = this;
				let formData = {
					id: parseInt(sessionStorage.getItem('ms_userId')),
					date:self.form.date,
					name:self.form.name,
					email: self.form.email,
					phone: self.form.phone,
					card: self.form.card,
					province: self.form.province,
					city: self.form.city,
					address: self.form.address,
					zip: self.form.zip
				};
						
				self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('/api/reader/addReader',self.form).then(function(response) {
							console.log(response);										
							self.$router.push('/success');
						}).then(function(error) {
							console.log(error);
						})
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
			},
        	onCancle() {
        		 this.$router.push('/userCenter');
        	}       	
		},
		//初始化
		mounted() {

		}  
	}
</script>

<style scoped>
	.userContent {
		margin: 0 auto;
	}
	.select-sex {
		width: 320px;
	}
</style>