<template>
	<div>
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>读者用户详情</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="userContent">
			    <h1>{{this.$route.params.id}}</h1>
				<p>{{data.id}}</p>
				<p>{{data.date}}</p>
				<p>{{data.name}}</p>
				<p>{{data.province}}</p>
				<p>{{data.city}}</p>
				<p>{{data.address}}</p>
				<p>{{data.zip}}</p>
				<p>{{data.phone}}</p>
				<p>{{data.card}}</p>
				<p>{{data.email}}</p>
		</div>
	</div>
</template>

<script>
	import Util from '../../utils/utils';
	import { Message } from 'element-ui';
	export default {
		    methods: {
		      handleClick(row) {          
		        console.log(row);
		      },
		    },
		    data() {
		      return {
		         data:{
		            id:'',
		            date:'',
		            name:'',
		            province:'',
		            city:'',
		            address:'',
		            zip:'',
		            phone:'',
		            card:'',
		            email:''
		        },
		      }
		    },
	    created:function() {
		    	const self = this;
		    	const uid= this.$route.params.id;
				self.$http.get(`/api/reader/getReaderdetail/${this.$route.params.id}`).then(function(response) {
				/*let result = response.data;*/
				/*console.log(result);*/
				self.data=response.data[0];	
				}).then(function(error) {
					console.log(error);
				})
		   }
		  }
</script>

<style scoped>
	.userContent {
		margin: 0 auto;
		width:100%;
	}
	.select-sex {
		width: 320px;
	}
</style>