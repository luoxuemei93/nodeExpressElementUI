<template>
	<div>
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>新闻添加</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<div class="userContent" style="width:400px">
        <form action="/upload-single" method="post" enctype="multipart/form-data">
            <h2>单图上传</h2>
            <input type="file" name="logo">
            <input type="submit" value="提交">
        </form>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {};
    let ChangeAvatar = (img) => axios({
      url: '/api/news/changeavatar',
      method: 'post',
      anync: true,
      contentType: false,
      processData: false,
      data: img
      })
  },
methods: {
    changeAvatar (event) {
      let img = event.target.files[0];
      let size = img.size;
      if (size > 3145728) {
        alert('请选择3M以内的图片！');
        return false;
      }
      let Form = new FormData();
      Form.append('avatar', img, this.avatar_name);
      API.ChangeAvatar(Form)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }
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