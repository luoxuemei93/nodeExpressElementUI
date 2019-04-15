<template>
    <div class="header">
        <div class="logo">哈哈镜订货系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/user.png">
                    <span>欢迎你，{{this.name}}</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <!--<el-dropdown-item command="userCenter">个人中心</el-dropdown-item>-->
                    <el-dropdown-item>
                        <span><router-link to="/modifyPassword" style="color: #606266">修改密码</router-link></span>
                    </el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="menuBar">
            <span class="memuBtn" @click="routerClick('shop')">
                <router-link to="/shop">商品下单</router-link>
            </span>
            <span class="memuBtn" @click="routerClick('viewOrder')">
                <router-link to="/viewOrder">订单管理</router-link>
            </span>
            <span class="memuBtn" @click="routerClick('productImg')" v-if="name == 'admin'">
                <router-link to="/productImg">商品图片</router-link>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: ''
            }
        },
        computed:{},
        created(){
           this.name = sessionStorage.getItem('ms_usernatme');
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.removeItem('ms_username')
                    sessionStorage.removeItem('ms_userId')
                    this.$router.push('/login');
                } else if (command == 'userCenter') {
                    this.$router.push('/userCenter');
                }
            },
            routerClick(page){
                this.$router.push('/'+page);
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:200px;
        text-align: center;
    }
    .menuBar {
        width: 50%;
        height: 100%;
        float: right;
        display: inline;
    }
    .menuBar .memuBtn:hover{
        color: #fff;
        cursor: pointer;
    }
    .menuBar .memuBtn {
        font-size: 16px;
        padding: 8px;
        margin: 0px 10px;
        background: #20a0ff;
        border-radius: 5px;
        color: #fff;
    }
    .menuBar .memuBtn a{
        color: #fff;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
