<template>
	<div>
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>读者用户列表</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="select-form">
			 <el-form :inline="true" ref="formInline" :model="formInline" :rules="rules" class="demo-form-inline">
				<el-form-item label="姓名">
					<el-input v-model="formInline.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item label="省份">
					<el-input v-model="formInline.province" placeholder="省份"></el-input>
				</el-form-item>
				<el-form-item label="身份证">
					<el-input v-model="formInline.card" placeholder="身份证"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit('formInline')">查询</el-button>
					<el-button type="info"  @click="reset()">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="userContent">
				<el-table
				    v-loading="loading"
				     :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
				    border
				    style="width: 100%">
				    <el-table-column
				      prop="id"
				      fixed
				      label="ID">
				    </el-table-column>
				    <el-table-column
				      prop="date"
				      label="日期"
				      width="150">
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="姓名">
				    </el-table-column>
				    <el-table-column
				      prop="phone"
				      label="电话"
				       width='140'>
				    </el-table-column>
				    <el-table-column
				      prop="card"
				      label="身份证"
				       width='180'>
				    </el-table-column>
				    <el-table-column
				      prop="email"
				      label="邮箱"
				      width='180'>
				    </el-table-column>
				    <el-table-column
				      prop="province"
				      label="省份">
				    </el-table-column>
				    <el-table-column
				      prop="city"
				      label="市区">
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="地址"
				      width="160">
				    </el-table-column>
				    <el-table-column
				      prop="zip"
				      label="邮编"
				      width="120">
				    </el-table-column>
				    <el-table-column
				      fixed="right"
				      label="操作"
				      width="165">
				      <template slot-scope="scope">
				      	<router-link :to="`/readerDetail/${scope.row.id}`">查看</router-link>
				      	<router-link :to="{name:'readerDetail', params: {id:scope.row.id} }">跳转</router-link>
				        <el-button type="text" size="small"  @click="getReaderData(scope.row.id)">编辑</el-button>
						<el-button type="text" size="small"  @click="deletClick(scope.row.id)">删除</el-button>
				      </template>
				    </el-table-column>
				 </el-table>
				 <div class="pagination">
                         <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[2,5, 10, 20, 40]"
                            :page-size="pagesize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="tableData.length">
                         <!--:page-sizes//这是下拉框可以选择的，每选择一行，要展示多少内容
							:page-size//显示当前行的条数
						    :total //这是显示总共有多少数据， -->
                       </el-pagination>

				</div>
				 <!--编辑弹层-->
				 <el-dialog title="用户列表编辑" :visible.sync="dialogFormVisible">
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
								<el-button type="primary" @click="updateReaderData('form')">确定</el-button>
								<el-button @click="onCancle()">取消</el-button>
							</el-form-item>
					</el-form>
				</el-dialog>
				<!--编辑弹层-->
		</div>
	</div>
</template>

<script>
	import Util from '../../utils/utils';
	import { Message } from 'element-ui';
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
				currentPage:1, //初始页
                pagesize:5,    //    每页的数据
				visible2: false,
		        tableData: [],
				dialogFormVisible: false,
				form: {
						id:'',
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
			    loading: true,
			    formInline: {
					name: '',
					province: '',
					card:''
					},
				rules: {
					id: [
                        { required: true, message: '请输入ID', trigger: 'blur' }
                    ],
					date: [
                        { required: true, message: '请输入日期', type: 'string', trigger: 'blur' }
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
               },
			    formLabelWidth: '100px'
		      }
		    },
		    methods: {
		      handleClick(row) {
		        console.log(row);
			  },
			  //获取列表
			  getreaderList(){
                 const self = this;
				self.$http.get('/api/reader/getReader').then(function(response) {
					console.log(response);
					let result = response.data;
					self.tableData=result;
				}).then(function(error) {
					console.log(error);
				})
		       setTimeout(() => {
					this.loading=false;
					}, 2000);
			  },
		      //删除用户记录
		      deletClick(uid){
		        const self = this;
				self.$http.post('/api/reader/deleteReader',{id:uid}).then(function(response) {
					if(response='ok'){
						 this.$message({
							message: '恭喜你,删除成功！',
							type: 'success'
							});
					}
					// self.$router.push('/readerAdd');
				}).then(function(error) {
					console.log(error);
				})
		      },
		      //编辑用户记录
		      getReaderData(uid) {
		      	this.dialogFormVisible=true;
				const self = this;
				self.$http.get(`/api/reader/getReaderdetail/${uid}`).then(function(response) {
					console.log(response);
					let result = response.data[0];
					self.form.id = result.id;
					self.form.date = result.date;
					self.form.name = result.name;
					self.form.email = result.email;
					self.form.phone = result.phone;
					self.form.card = result.card;
					self.form.province =result.province;
					self.form.city =result.city;
					self.form.address =result.address;
					self.form.zip =result.zip;
				}).then(function(error) {
					console.log(error);
				})
			},
			updateReaderData(formName) {
				const self = this;
				let formData = {
					id: self.form.id,
					date:self.form.date,
				    name:self.form.name,
					email:self.form.email,
					phone:self.form.phone,
					card:self.form.card,
					province:self.form.province,
					city:self.form.city,
					address:self.form.address,
					zip:self.form.zip
				};

				self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('/api/reader/updateReader',formData).then(function(response) {
							/*console.log(response);		*/
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
		    onSubmit(formValue) {
				const self = this;
				let formData = {
				    name:self.formInline.name,
					province:self.formInline.province,
					card:self.formInline.card,
				};
				self.$refs[formValue].validate((valid) => {
                    if (valid) {
                        self.$http.post('/api/reader/jiansuo',formData).then(function(response) {
					        console.log(response);
							let result = response.data;
							self.tableData=result;
						}).then(function(error) {
							console.log(error);
						})
                    }
                });
			},
			reset(){
				const self = this;
				self.$http.get('/api/reader/getReader').then(function(response) {
					console.log(response);
					let result = response.data;
					self.tableData=result;
				}).then(function(error) {
					console.log(error);
				})
			},
			        // 初始页currentPage、初始每页数据数pagesize和数据data
        handleSizeChange: function (size) {
                this.pagesize = size;
                console.log(this.pagesize)  //每页下拉显示数据
        },
        handleCurrentChange: function(currentPage){
                this.currentPage = currentPage;
                console.log(this.currentPage)  //点击第几页
        },
},
    //钩子函数获取用户列表
		    created: function() {
		    	this.getreaderList();
			},

	}
</script>

<style scoped>
	.userContent {
		margin: 0 auto;
		width:100%;
	}
	.userContent .el-table trfirst-child{
       background-color: #0504ef;
     }
	a {
    text-decoraction: none;
	color:#20a0ff;
    }
	.pagination{
		text-align: center;
	}
	.select-sex {
		width: 320px;
	}
</style>
