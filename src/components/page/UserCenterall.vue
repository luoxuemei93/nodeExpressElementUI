<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i>个人中心</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="userContent">
             <el-card class="leftcard">
				 <div style="width:100%;height:300px;margin-b0ttom:20px;">
					 <img class="pre-img" :src="src" alt="">
					 <h2>{{form.name}}{{form.account}}</h2>
					 <p>邮箱：{{form.email}}</p>
					 <p>手机：{{form.phone}}</p>
					 <p>性别：{{form.sex}}</p>
					 <p>身份证：{{form.card}}</p>
					 <p>出生年月：{{form.birth}}</p>
				 </div>
			 </el-card>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
            return {
				form: {
					name:'',
					account:'',
					email:'',
				    phone:'',
					card:'',
					birth:'',
					sex:''
				},
				items:[
					{title:'',name:'',text:''},
					{title:'',name:'',text:''},
					{title:'',name:'',text:''},
					{title:'',name:'',text:''}
				],
				currentDate: new Date(),
				src: './static/img/img.jpg',
			}
		},
		methods:{
			//用户中心账户板数据
        	getUserData() {
				const self = this;
				let username = sessionStorage.getItem('ms_user').name;
				self.$http.get('/api/user/getUser',{name: username}).then(function(response) {
					console.log(response);
					let result = response.data[0];
					self.form.name = result.username;
					self.form.account = result.account;
					self.form.email = result.email;
					self.form.phone = result.phone;
					self.form.card = result.card;
					self.form.birth = new Date(result.birth);
					self.form.sex = result.sex;
					sessionStorage.setItem('ms_userId', result.id);
				}).then(function(error) {
					console.log(error);
				})
			},
			//用户中心折叠板数据
			getUserCenter() {
				const self = this;
				self.$http.get('/api/user/getUsercenter').then(function(response) {
					let result = response.data;
					self.items=result;
				}).then(function(error) {
					console.log(error);
				})
			},
		},
		mounted() {
			this.getUserData();
			this.getUserCenter();
		}
    }

</script>

<style lang="less" scoped>
.userContent {
		width: 100%;
		margin: 0 auto;
	}
	.select-sex {
		width: 320px;
	}
	.leftcard{
		width:25%;
		height:800px;
		float:left;
		h2{
			color:#5b5b5b;
			font-size: 16px;
			text-align: center;
		}
		p{
			margin: 10px 0;
            color:#5b5b5b;
			font-size: 14px;
			text-align: left;
		}
	}
   .rightcard{
		width:70%;
	    height:800px;
		float:right;
	}
	.pre-img{
		width:100px;
		height:100px;
		border-radius:50%;
	    margin-left: 25%;
	}
	  .time {
				font-size: 13px;
				color: #999;
			}

			.bottom {
				margin-top: 13px;
				line-height: 12px;
			}

			.button {
				padding: 0;
				float: right;
			}

			.image {
				width: 100%;
				display: block;
			}

			.clearfix:before,
			.clearfix:after {
				display: table;
				content: "";
			}

			.clearfix:after {
				clear: both
			}
</style>
