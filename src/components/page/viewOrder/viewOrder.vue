<!--查看所有订单-->
<template>
    <div class="app-container" style="padding: 4px">
        <!--搜索栏-->
        <!--<div class="filter-container">-->
            <!--<el-row>-->
                <!--<el-col :span="5">-->
                    <!--<span class="filter-span">产品名称</span>-->
                    <!--<el-input clearable @clear="handleClearFilter('productName')" size="small"  @keyup.enter.native="handleFilter" class="filter-item" v-model="listQuery.productName_LK_S"> </el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="5">-->
                    <!--<span class="filter-span">产品描述</span>-->
                    <!--<el-input clearable @clear="handleClearFilter('productDesc')" size="small" @keyup.enter.native="handleFilter" class="filter-item" v-model="listQuery.productDesc_LK_S"> </el-input>-->
                <!--</el-col>-->
                <!--<el-col :span="5">&nbsp;</el-col>-->
                <!--<el-col :span="5">&nbsp;</el-col>-->
                <!--<el-col :span="4">-->
                    <!--<el-button  size="medium" type="primary"  @click="handleFilter" >搜索</el-button>-->
                    <!--<el-button  size="medium" type="danger"   @click="handleReset"  >清空</el-button>-->
                    <!--&lt;!&ndash;<el-button  size="medium" type="success"  @click="handleCreate" >添加</el-button>&ndash;&gt;-->
                <!--</el-col>-->
            <!--</el-row>-->
        <!--</div>-->
        <!--表格-->
        <div style="height: 90%;overflow-y: auto">
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @sort-change = sortChange
                  border  fit highlight-current-row >
            <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
            <el-table-column width="" align="left" label="订单号"><template slot-scope="scope"><span>{{scope.row.orderNumber}}</span></template></el-table-column>
            <el-table-column width="" align="left" label="订单状态"><template slot-scope="scope"><span>{{scope.row.orderState}}</span></template></el-table-column>
            <el-table-column width="" align="left" label="产品种类数"><template slot-scope="scope"><span>{{scope.row.productTypesCount}}</span></template></el-table-column>
            <el-table-column width="" align="left" label="订单总价"><template slot-scope="scope"><span>{{scope.row.totalPrice}}</span></template></el-table-column>
            <el-table-column width="" align="left" label="下单时间"><template slot-scope="scope"><span :title="scope.row.orderDate">{{scope.row.orderDate}}</span></template></el-table-column>
            <el-table-column width="" align="left" label="下单用户"><template slot-scope="scope"><span>{{scope.row.userName}}</span></template></el-table-column>
            <el-table-column fixed="right" width="220" align="center" label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleView(scope.row)">详情</el-button>
                    <!--<el-button size="mini" type="success" @click="handleUpdate(scope.row)">编辑</el-button>-->
                    <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div v-show="!listLoading" class="pagination-container" style="text-align: right" >
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="listQuery.pageSize"
                :total="total"
                layout="total,  prev, pager, next, jumper">
            </el-pagination>
        </div>
        </div>
        <!--新增弹窗(添加，编辑)-->
        <el-dialog title="订单商品详情" v-loading ="isloadingDialog" center  class="dialogWidth55" :close-on-click-modal=false :visible.sync="dialogFormVisible" @close="closeDialog('form')">
            <div class="shopCarItem" v-for="(item,index) in orderDetailList">
                <div style="position: absolute;left: 0px;top:35px;">{{index+1}}</div>
                <div class="itemImg">
                    <img :src="getImgUrl(item.picturePath)"
                         style="max-width: 100%;height: 100%;margin: auto;display: block;"/>
                </div>
                <div class="itemTxtArea">
                    <div>{{item.productDesc}}</div>
                    <div style="width: 100%;float: left">
                        <span style="float: left;display: inline-block;width: 30%;margin-right: 3%;">规格：{{item.productSize}}</span>
                        <span style="float: left;">保质期：{{item.shelfLife}}</span>
                    </div>
                    <div style="width: 100%;float: left">
                        <span style="float: left;display: inline-block;width: 30%;margin-right: 3%;">单价：￥{{item.salePrice}}</span>
                        <span style="float: left;display: inline-block;width: 30%;margin-right: 3%;">下单数：￥{{item.quantity}}</span>
                        <span style="float: left;display: inline-block;width: 30%;">总价：￥{{item.salePrice * item.quantity}}</span>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                <el-button v-if="dialogStatus=='update'"  type="primary" @click="update('form')">确 定</el-button>
                <el-button v-if="dialogStatus=='create'||dialogStatus=='update'"  type="warning" @click="cancel('form')">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'viewOrder',
         data() {
            return {
                form: {
                    orderNumber: undefined,
                    orderState: undefined,
                    userName: undefined,
                    productId: undefined,
                    productDesc: undefined,
                    productSize: undefined,
                    unit: undefined,
                    quantity: undefined,
                    salePrice: undefined,
                    volume: '1',
                    qualityPeriod: undefined,
                    orderDate: undefined,
                },
                rules: {},
                rulesPsw: {
                    newPsw: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 5, max: 20, message: '密码长度为5-20个字符', trigger: 'blur' }],
                    ckNewPsw: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }, { min: 5, max: 20, message: '密码长度为5-20个字符', trigger: 'blur' }],
                },
                orderDetailList:[], //订单明细
                startDatePicker: this.beginDate(),
                endDatePicker: this.processDate(),
                list: null,
                total: null,
                dialogFormVisible:false,
                isloadingDialog: false,
                listLoading: false,
                optionsTree:[],
                deptCodeTree:[],
                listQuery: { // 查询数据是传递给后台的参数
                    pageNo: 1,
                    pageSize: 20,
                    userName:sessionStorage.getItem("ms_usernatme"),
                },
                listQueryRole: {
                    groupType: this.type,
                    name: undefined
                },
                treeData: [],
                curActionUserID: '', // 用于角色赋权的时候保存当前
                tipSpan: false,
                dialogStatus: '',
                textMap: {
                    view: '查看',
                    update: '编辑',
                    create: '创建'
                },
                tableKey: 0,
                pickerOptionsLessToday: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            }
        },
        beforeCreate() {},
        created() {
            this.getList();
        },

        methods: {
            geListTotal(item){   // 查询右侧的数据total
                const self = this;
                self.$http.post('/api/viewOrder/getViewOrderTotal',item).then((rsp) => {
                    this.total = rsp.data[0].total;
                })
            },
            getList() {
                const self = this;
                this.geListTotal();
                self.$http.post('/api/viewOrder/getViewOrderList',self.listQuery).then((rsp) => {
                    if(rsp.data.status ==200){
                        this.list = rsp.data.rows;
                    } else {
                        this.$notify({title: '失败', message: rsp.data.msg, type: 'warning', duration: 3000});
                    }
                })
            },
            handleView(row) {   //查看详情
                this.dialogFormVisible = true;
                const self = this;
                self.$http.post('/api/viewOrder/getViewOrderDetailList',{orderNumber:row.orderNumber}).then((rsp) => {
                    console.log(rsp)
                    if(rsp.data.status ==200){
                        this.orderDetailList = rsp.data.rows;
                        console.log(this.orderDetailList);
                    } else {
                        this.$notify({title: '失败', message: rsp.data.msg, type: 'warning', duration: 3000});
                    }
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
            handleFilter() {  // 搜索事件
                this.listQuery.pageNo = 1;
                this.getList();
            },
            handleReset() {  // 清空搜索框
                this.resetForm();
                this.getList();
            },
            handleSizeChange(val) { // 分页变化-当前页显示条数
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {  // 分页变化-翻页
                this.listQuery.pageNo = val;
                this.getList();
            },
            handleCreate() {  // 添加用户按钮
                this.resetTemp(); // 清除旧数据
                this.dialogStatus = 'create'; // 定义弹窗为“新增”
                this.dialogFormVisible = true;
            },
            handleUpdate(row) { // 编辑用户信息

            },
            handleRole(row) {  // 角色赋权弹窗

            },
            handleDelete(row) { // 数据删除操作

            },
            create(formName) {  // 新增确认

            },
            cancelPsw(formName){
                this.$refs[formName].resetFields();
                this.dialogPswVisible=false;
            },
            beginDate() {
                const self = this
                return {
                    disabledDate(time){
                        if (self.form.accountFailTime) {  //如果结束时间不为空，则小于结束时间
                            return new Date(self.form.accountFailTime).getTime() < time.getTime()
                        }
                    }
                }
            },
            processDate() {
                const self = this
                return {
                    disabledDate(time) {
                        if (self.form.accountEffectTime) {  //如果开始时间不为空，则结束时间大于开始时间
                            return new Date(self.form.accountEffectTime).getTime() > time.getTime()
                        }
                    }
                }
            },


            cancel(formName) {  // 取消新增
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            update(formName) { // 修改确认
                this.isloadingDialog = true;
                const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        this.form.password = undefined;

                    } else {
                        this.isloadingDialog = false;
                        return false;
                    }
                });
            },


            handleClearFilter(str) { // clearable 事件触发搜索
                if (str == 'productName') { this.listQuery.productName_LK_S = undefined; }
                if (str == 'productDesc') { this.listQuery.productDesc_LK_S = undefined; }
                this.getList();
            },
            sortChange(column) {  // 表格排序功能
                const prop = column.prop;
                const order = column.order;
                if (prop != null && order != null) {
                    this.listQuery.orderBy = [prop + '_' + order];
                } else {
                    this.listQuery.orderBy = undefined;
                }
                this.getList();
            },
            closeDialog(formName) {
                this.cancel(formName);
            },
            indexMethod(index) {  // 数据列编号
                return (index * 1) + 1 * 1;
            },
            resetForm() {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = 20;
                this.listQuery.productName_LK_S = undefined;
                this.listQuery.productDesc_LK_S = undefined;
            },
            resetTemp() { // 清空数据
                this.form = {
                    orderNumber: undefined,
                    orderState: undefined,
                    userName: undefined,
                    productId: undefined,
                    productDesc: undefined,
                    productSize: undefined,
                    unit: undefined,
                    quantity: undefined,
                    salePrice: undefined,
                    volume: '1',
                    qualityPeriod: undefined,
                    orderDate: undefined,
                };
            }
        }
    }
</script>

<style rel="stylesheet/scss" scoped>
    /* 购物车弹窗*/
    .shopCarItem {
        margin: 10px 0px;
        height: 80px;
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
</style>
