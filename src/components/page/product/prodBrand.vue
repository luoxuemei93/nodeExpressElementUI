<!--新增品牌-->
<template>
    <div class="prodBrandCls">
        <div class="addArea">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="品牌名称">
                    <el-input v-model="form.pname"></el-input>
                </el-form-item>
               <div class="subBrandLabel">
                   <span>子品牌</span>
                   <el-button @click="addSubInput">增加</el-button>
                   <el-button @click="delSubInput">删除</el-button>
               </div>
                <el-form-item label="">
                    <div v-for="(item,index) in form.subName.length">
                        <el-input  v-model="form.subName[index]" class="subBrandInput"></el-input>
                    </div>
                </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    pname: '',
                    subName:[''],
                },
                formSubName:1,
            }
        },
        methods: {
            addSubInput(){  //添加子品牌
                this.form.subName.push("");
                console.log(this.form.subName);
            },
            delSubInput(){  // 删除子品牌

            },
            onSubmit() {
                console.log(this.form);
                const self = this;
                self.$http.post('/api/product/addBrand',(self.form)).then((rsp) => {
                    console.log(rsp);
                    if(rsp.data.status == '200'){
                        this.$notify({title: '成功', message:rsp.data.msg, type: 'success', duration:3000});
                        this.form.pname = "";
                        this.form.subName= [""];
                    } else {
                        this.$notify({title: '异常', message: rsp.data.msg, type: 'warning', duration:3000});
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .prodBrandCls {
        width:100%;
        height: 100%;
    }
    .addArea {
        width: 60%;
        height: 100%;
    }
    .subBrandLabel {
        font-size: 12px;
        color: #48576a;
        width: 100%;
        text-align: center;
        padding: 10px;
    }
    .subBrandInput {
        margin: 3px 0px;
    }
</style>
