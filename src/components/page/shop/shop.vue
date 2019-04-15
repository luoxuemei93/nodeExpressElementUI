<!--查看所有订单-->
<template>
    <div class="app-container flexBox shopCls">
       <!--左侧-->
        <div class="shopLeft">
            <div class="listOutter" v-loading="brandLoading">
                <div class="listQry fixedHig">
                    <div>类型选择</div>
                    <div>
                        <el-input placeholder="请输入内容" v-model="brandFilterVal"
                                  clearable @clear="clearFliter('brandFilterVal')"
                                  @keyup.enter.native="queryBrandFun"
                                  class="input-with-select">
                            <el-button slot="append" icon="el-icon-search" @click="queryBrandFun"></el-button>
                        </el-input>
                    </div>
                </div>
                <div class="listRst autoFullHig">
                    <el-scrollbar>
                        <div class="eachItem" @click="getDetial()" style="text-align: center;color: #111;">查询全部</div>
                        <div
                            class="eachItem"
                            v-for="(item,index) in brandList"
                            :class="{'isActive':isCurBrand.classId==item.classId}"
                            @click="getDetial(item)">
                            <div>{{item.className}}</div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
        <!--右侧-->
        <div class="shopRight flexAutoWidth">
            <div class="listOutter flexColumBox">
                <div class="listQry fixedHig">
                    <el-row>
                        <el-col :span="3"><span>搜索结果</span></el-col>
                        <el-col :span="18">
                            <el-pagination
                                background
                                style="text-align: center;"
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :page-size="listQuery.pageSize"
                                layout="total, prev, pager, next"
                                :total="total">
                            </el-pagination>
                        </el-col>
                        <el-col :span="3">
                                <span @click="showShopCarDialog" class="shopCarCls">
                                    <span><img src="../../../../static/img/shopcar.png" style="height: 40px;"/></span>
                                    <span class="shopCarOrderNumCls">{{shopCarList.length}}条</span>
                        </span>
                        </el-col>
                    </el-row>
                </div>

                <!--商品展示信息-->
                <div class="listRstRight autoFullHig" style="overflow-y: auto" v-if="brandDetailList.length>0"
                     v-loading="isLoading">
                    <div class="eachItem" v-for="(item,index) in brandDetailList" @click="doOrder(item,index)">
                        <el-card class="box-card">
                            <div class="text item">
                                <div class="imgCls">
                                    <img :src="getImgUrl(item.picturePath)"/>
                                </div>
                                <div class="descCls" :title="item.productDesc">{{item.productDesc}}</div>
                                <div class="orderBtn">
                                    <span style="float: left;display: inline-block;">￥{{item.salePrice}}</span>
                                    <el-button type="primary" size="small">订购</el-button>
                                </div>
                                <div></div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <div v-if="!isLoading && brandDetailList.length ==0">
                    <div style="width: 100%;color: #999;margin-top: 30px;text-align: center;">暂无商品信息</div>
                </div>
            </div>
        </div>

        <!-- 商品明细弹窗 -->
        <el-dialog title="商品订购信息" :visible.sync="dialogVisible" v-loading="prodLoading" width="40%" height="300px" class="dialogWidth45" :before-close="handleClose">
            <div class="dialogLeft">
                <div class="imgCls">
                    <img :src="getImgUrl(formData.picturePath)" style="width: 90%;margin: 5px 5%;"/>
                </div>
            </div>
            <div class="dialogRight">
                <div class="dialogEachCls">
                    <span class="label">产品描述：</span>
                    <span>{{formData.picturePath}}</span>
                </div>
                <div class="dialogEachCls">
                    <span class="label">价格：</span>
                    <span>￥{{formData.salePrice}}</span>
                </div>
                <div class="dialogEachCls">
                    <span class="label">规格：</span>
                    <span>{{formData.productSize}}</span>
                </div>
                <div class="dialogEachCls">
                    <span class="label">重量：</span>
                    <span>{{formData.weight}}</span>
                </div>
                <div class="dialogEachCls">
                    <span class="label">保质期：</span>
                    <span>{{formData.shelfLife}}</span>
                </div>
                <div class="dialogEachCls">
                    <span class="label">数量：</span>
                    <span>
                        <el-input-number v-model="formData.orderNum"></el-input-number>
                    </span>
                </div>
                <!--<div class="dialogEachCls" style="margin-top: 10px;">-->
                    <!--<span class="label">总价：</span>-->
                    <!--<span style="padding: 10px;background: #ccc;border: 1px solid #dcdfe6;border-radius: 5px;">{{formData.orderNum*formData.salePrice}}</span>-->
                <!--</div>-->
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInShopCar(formData)">加入购物车</el-button>
            </span>
        </el-dialog>

        <!--购物车弹窗-->
        <el-dialog title="购物车" :visible.sync="dialogCarVisible" class="dialogWidth55"
                   :before-close="handleCarClose">
            <div class="shopCarItem" v-for="(item,index) in shopCarList">
                <div style="position: absolute;left: 0px;top:35px;">{{index+1}}</div>
                <div class="itemImg">
                    <img :src="getImgUrl(item.picturePath)"
                         style="max-width: 100%;height: 100%;margin: auto;display: block;"/>
                </div>
                <div class="itemTxtArea">
                    <div>{{item.productDesc}}</div>
                    <div style="width: 100%;float: left">
                        <span style="float: left;display: inline-block;width: 35%;margin-right: 5%;">规格：{{item.productSize}}</span>
                        <span style="float: left;">保质期：{{item.shelfLife}}</span>
                    </div>
                    <div style="width: 100%;float: left">
                        <span style="float: left;display: inline-block;width: 35%;margin-right: 5%;">单价：￥{{item.salePrice}}</span>

                    </div>
                    <div>
                        <el-input-number v-model="item.quantity" label="下单数量" style="float: left;"></el-input-number>
                        <span style="float: left;margin-left:20px;padding: 9px;background: rgb(204, 204, 204);border: 1px solid rgb(220, 223, 230);border-radius: 5px;">总价：￥{{item.salePrice*item.quantity}}</span>
                    </div>
                </div>
                <div class="itemBtnArea">
                    <span class="removeCls" @click="removeShopCar(item)">移除</span>
                </div>
            </div>
            <div v-if="shopCarList.length == 0" style="display: inline-block;text-align: center;color: #ccc;width: 100%;">
                购物车为空
            </div>
            <span slot="footer" class="dialog-footer">
                <!--<el-button @click="removeShopCar">移出购物车</el-button>-->
                <!--<el-button @click="handleCarClose">关闭</el-button>-->

                <span style="display: inline-block;margin-right: 10px;font-size: 14px;font-weight: 600;">
                    合计总价：￥{{shopCarPriceTotal}}
                </span>
                <el-button type="primary" @click="doShopFromCar">确认订购</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {curTimeFun} from '../../../../public/js/page';
    import Vue from 'vue';

    export default {
        name: 'viewOrder',
        data() {
            return {
                brandLoading: false,
                brandFilterVal: '',
                checkedList: [],
                brandListOrg: [],   //品牌列表,原始数据，用于搜索的时候还原使用
                brandList: [],   //品牌列表
                brandDetailList: [], //品牌明细列表
                isCurBrand: {
                    classId: '',
                    className: ''
                },
                isLoading: false,
                total: 0,
                dialogVisible: false,    //商品详情
                prodLoading: false,      // 商品详情
                dialogCarVisible: false, // 购物车
                prodCarLoading: false,   // 购物车
                listQuery: { // 查询商品列表
                    pageNo: 1,
                    pageSize: 10,
                    className: '',
                },
                formData: {
                    picturePath: '',
                    salePrice: null,
                    productSize: null,
                    weight: null,
                    shelfLife: null,
                    orderNum: 1,
                    totalPrice:0
                },    // 弹窗信息
                shopCarOrderNum: 0,
                shopCarList: [], // 购物车清单
                shopCarPriceTotal:'',   // 购物车总金额
            }
        },
        beforeCreate() {},
        watch:{
            shopCarList:{
                handler(newVal,oldVal){
                    this.shopCarPriceTotal = 0;
                    for(let i = 0;i<newVal.length;i++){
                        this.shopCarPriceTotal +=newVal[i].quantity * newVal[i].salePrice;
                    }
                },
                deep:true
            },
        },
        created() {
            this.getBrandList();
            this.getDetialTotal();
            this.getDetial();
            this.getShopingCarList();
        },
        methods: {
            getBrandList() { // 查询左侧商品类别列表
                const self = this;
                this.brandLoading = true;
                self.$http.post('/api/product/getBrandList').then((rsp) => {
                    this.brandLoading = false;
                    this.brandList = rsp.data;
                    this.brandListOrg = rsp.data;
                })
            },
            clearFliter(type) {
                if (type == 'brandFilterVal') {
                    this.brandList = this.brandListOrg;
                }
            },
            queryBrandFun() {
                var isNoMatch = 0;
                var isMatchAry = [];
                if (this.brandFilterVal == "") {
                    this.brandList = this.brandListOrg;
                    return false;
                }
                this.brandList = this.brandListOrg;
                for (var i = 0; i < this.brandList.length; i++) {
                    if ((this.brandList[i].className).indexOf(this.brandFilterVal) != '-1') {   // 模糊匹配
                        isMatchAry.push(this.brandList[i]);
                    } else {
                        isNoMatch++;
                    }
                }
                if (isNoMatch == 0) {
                    this.brandList = [];
                } else {
                    this.brandList = isMatchAry;
                }
            },
            getDetialTotal(item) {   // 查询右侧的数据total
                const self = this;
                self.$http.post('/api/product/getBrandDetailTotal', item).then((rsp) => {
                    this.total = rsp.data[0].total;
                })
            },
            getDetial(item, isPage) {  //查询右侧的商品明细，根据id
                console.log('查询商品明细isPage='+isPage);
                this.getDetialTotal(item);
                const self = this;
                this.brandDetailList = [];
                this.isLoading = true;
                if (!isPage) {    //表示是否分页isPage=true,isPage=false表示不分页，则需要把页码重新置为1，20
                    this.listQuery.pageSize = 20;
                    this.listQuery.pageNo = 1;
                }
                if (item) {
                    this.listQuery.className = item.className;
                    this.isCurBrand.classId = item.classId;
                    this.isCurBrand.className = item.className;
                } else {
                    this.listQuery.className = "";
                    this.isCurBrand.classId = undefined;
                    this.isCurBrand.className = undefined;
                }
                self.$http.post('/api/product/getBrandDetailList', this.listQuery).then((rsp) => {
                    this.isLoading = false;
                    this.brandDetailList = rsp.data;
                })
            },
            getImgUrl(picturePath) {   //根据商品名称展示商品图片
                if(picturePath){
                    const fileName = picturePath.substring(0,4);
                    return "/static/img/product/" + fileName+'/'+picturePath + '.jpg';
                } else {
                    return "";
                }
            },
            doOrder(item, index) {    // 订购操作，根据
                this.dialogVisible = true;
                this.formData = item;
                Vue.set(this.formData, 'orderNum', 1);
                // this.formData.orderNum = 1;
            },
            getShopingCarList() {    // 刷新购物车数据
                this.checkedList = [];  // 清空勾选信息
                const param = {userName: sessionStorage.getItem("ms_usernatme")}
                const self = this;
                this.prodCarLoading = true;
                self.$http.post('/api/product/queryOrderProd', param).then((rsp) => {
                    this.prodCarLoading = false;
                    if (rsp.status == 200) {
                        this.shopCarList = rsp.data;
                    } else {
                        this.shopCarList = [];
                    }
                })
            },
            saveInShopCar(formItem) {    //加入购物
                let orderDataList = formItem;
                orderDataList.userName = sessionStorage.getItem("ms_usernatme");
                orderDataList.orderDate = curTimeFun("", '-');
                const self = this;
                self.$http.post('/api/product/saveOrderProd', orderDataList).then((rsp) => {
                    if (rsp.data.status == 200) {
                        this.getShopingCarList();   // 刷新购物车数据
                        this.$notify({title: '成功', message: rsp.data.msg, type: 'success', duration: 3000});
                        this.handleClose(); // 关闭弹窗
                    } else {
                        this.$notify({title: '失败', message: rsp.data.msg, type: 'warning', duration: 3000});
                    }
                })
            },
            showShopCarDialog() {    // 查看购物车
                this.dialogCarVisible = true;
            },
            removeShopCar(item) {    //移出购物车
                this.$confirm('此操作将把产品移出购物车, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(item);
                    const self = this;
                    const param = {
                        productId: item.productId,
                        userName: sessionStorage.getItem("ms_usernatme")
                    }
                    this.prodCarLoading = true;
                    self.$http.post('/api/product/delOrderProd', param).then((rsp) => {
                        this.prodCarLoading = false;
                        if (rsp.status == 200) {
                            this.checkedList = [];  // 清空勾选信息
                            this.getShopingCarList();   // 刷新购物车数据
                        } else {
                            this.$notify({title: '失败', message: rsp.data.msg, type: 'warning', duration: 3000});
                        }
                    })
                })
            },
            doShopFromCar() {    //从购物车中下单
                this.$confirm('是否下单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const self = this;
                    this.checkedList.orderDate = curTimeFun("", '-');    //修改下单时间为标注的时间格式
                    const param = {
                        optList: this.shopCarList,
                        orderDate: curTimeFun("", '-')
                    }
                    self.$http.post('/api/product/doShopFromCarProd', param).then((rsp) => {
                        if (rsp.data.status == 200) {
                            this.checkedList = [];  // 清空勾选信息
                            this.getShopingCarList();   // 刷新购物车数据
                            this.dialogCarVisible = false;
                            this.$notify({title: '成功', message: rsp.data.msg, type: 'success', duration: 3000});
                        } else {
                            this.$notify({title: '失败', message: rsp.data.msg, type: 'warning', duration: 3000});
                        }
                    })
                })
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getDetial(this.isCurBrand, true);//获取上次的分页参数
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                console.log('handleCurrentChange='+val);
                this.getDetial(this.isCurBrand, true);//获取上次的分页参数
            },
            handleClose() {  // 关闭商品信息
                this.formData = {};  //清空弹窗信息
                this.dialogVisible = false;
            },
            handleCarClose() {
                this.dialogCarVisible = false;
            }
        }
    }
</script>
<style rel="stylesheet/scss" scoped>
    .shopLeft {
        width: 200px;
        height: 100%;
        border-right: 1px solid #8c939d;
    }

    .shopCarCls {
        padding: 0px 20px;
        /*background: #93C4EA;*/
        border-radius: 5px;
        float: right;
        margin-right: 5px;
        font-size: 30px;
        right: 10px;
        position: relative;
    }

    .shopCarCls .fa {
        font-size: 50px;
    }

    .shopCarCls img:hover, .shopCarOrderNumCls:hover {
        cursor: pointer;
    }

    .shopCarOrderNumCls {
        color: red;
        display: inline-block;
        font-weight: 600;
        position: relative;
        top: -10px;
        font-size: 20px;
    }

    .listOutter {
        padding: 5px;
        height: 100%;
    }

    .listQry {
        height: 20%;
        max-height: 70px;
        width: 100%;
        position: relative;
    }

    .listRst {
        height: 78%;
        width: 100%;
    }

    .eachItem {
        font-size: 16px;
        background: #ccc;
        border-radius: 5px;
        padding: 4px;
        margin: 5px;
    }

    .listRstRight  .eachItem {
        background: none;
    }
    .eachItem:hover {
        cursor: pointer;
        color: #fff;
        background: #20a0ff;
    }

    .isActive {
        color: #fff;
        background: #20a0ff;
    }

    .shopRight {
        height: 100%;
    }

    /* 购物车弹窗*/
    .shopCarItem {
        margin: 10px 0px;
        height: 100px;
        padding: 3px 0px 5px 0px;
        border-bottom: 1px solid #eee;
        position: relative;
    }

    .shopCarItem .itemImg {
        height: 100%;
        width: 25%;
        float: left;
    }

    .shopCarItem .itemTxtArea {
        float: left;
        width: 68%;
    }

    .shopCarItem .itemBtnArea {
        float: left;
        width: 5%;
    }

    .shopCarItem .itemBtnArea .removeCls {
        padding: 5px;
        background: #DD5044;
        position: relative;
        display: inline-block;
        text-align: center;
        border-radius: 10px;
        color: #fff;
    }
    .removeCls:hover{
        cursor: pointer;
    }
</style>

