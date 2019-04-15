<!--商品管理页面-->
<template>
    <div class="app-container">
        <!--搜索栏-->
        <div class="filter-container">
            <el-row>
                <el-col :span="5">
                    <span class="filter-span">订单号</span>
                    <el-input clearable @clear="handleClearFilter('username')" size="small"  @keyup.enter.native="handleFilter" class="filter-item" v-model="listQuery.username_LK_S"> </el-input>
                </el-col>
                <el-col :span="5">
                    <span class="filter-span">姓名</span>
                    <el-input clearable @clear="handleClearFilter('name')" size="small" @keyup.enter.native="handleFilter" class="filter-item" v-model="listQuery.name_LK_S"> </el-input>
                </el-col>
                <el-col :span="5">&nbsp;</el-col>
                <el-col :span="5">&nbsp;</el-col>
                <el-col :span="4">
                    <el-button  size="medium" type="primary"  @click="handleFilter" >搜索</el-button>
                    <el-button  size="medium" type="danger"   @click="handleReset"  >清空</el-button>
                    <!--<el-button  size="medium" type="success"  @click="handleCreate" >添加</el-button>-->
                </el-col>
            </el-row>
        </div>
        <!--表格-->
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @sort-change = sortChange border  fit highlight-current-row>
            <el-table-column type="index" :index="indexMethod" label="序号" width="70"></el-table-column>
            <el-table-column width="" align="left" label="订单号">
                <template slot-scope="scope"><span>{{scope.row.orderNumber}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="订单状态">
                <template slot-scope="scope"><span>{{scope.row.orderState}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="用户名称">
                <template slot-scope="scope"><span>{{scope.row.userName}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="产品编码">
                <template slot-scope="scope"><span>{{scope.row.productId}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="产品描述">
                <template slot-scope="scope"><span>{{scope.row.productDesc}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="产品规格">
                <template slot-scope="scope"><span>{{scope.row.productSize}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="单位">
                <template slot-scope="scope"><span>{{scope.row.unit}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="数量">
                <template slot-scope="scope"><span>{{scope.row.quantity}}</span></template>
            </el-table-column>
            <el-table-column width=""align="left" label="下单时间">
                <template slot-scope="scope"><span>{{scope.row.orderDate}}</span></template>
            </el-table-column>
            <el-table-column width="" align="left" label="描述">
                <template slot-scope="scope"><span>{{scope.row.description}}</span></template>
            </el-table-column>
            <el-table-column fixed="right" width=""align="center" label="操作" >
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleView(scope.row)">详情</el-button>
                    <el-button size="mini" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <div v-show="!listLoading" class="pagination-container" style="text-align: right" >
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.page"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.limit"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

        <!--新增弹窗(添加，编辑)-->
        <el-dialog  :title="textMap[dialogStatus]" v-loading ="isloadingDialog" :close-on-click-modal=false :visible.sync="dialogFormVisible" @close="closeDialog('form')">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username"  clearable :placeholder="dialogStatus=='view'?'':'请输入账号'" :disabled="dialogStatus=='view'||dialogStatus=='update'"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="dialogStatus=='create'">
                    <el-input v-model="form.password" clearable type="password" :placeholder="dialogStatus=='view'?'':'请输入密码,英文字母，数字以及下划线组成'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" clearable :placeholder="dialogStatus=='view'?'':'请输入姓名'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码" prop="idNo">
                    <el-input v-model="form.idNo"  clearable :placeholder="dialogStatus=='view'?'':'请输入身份证号码'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="职务" prop="duty">
                    <el-input v-model="form.duty" clearable :placeholder="dialogStatus=='view'?'':'请输入职务'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="账号生效时间" prop="accountEffectTime">
                    <el-date-picker v-model="form.accountEffectTime"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"
                                    :picker-options="startDatePicker" :disabled="dialogStatus=='view'" type="datetime"  :placeholder="dialogStatus=='view'?'':'请输入账号生效时间'"></el-date-picker>
                </el-form-item>
                <el-form-item label="账号失效时间" prop="accountFailTime">
                    <el-date-picker v-model="form.accountFailTime"  format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%"
                                    :picker-options="endDatePicker" :disabled="dialogStatus=='view'" type="datetime"  :placeholder="dialogStatus=='view'?'':'请输入账号失效时间'"></el-date-picker>
                </el-form-item>
                <el-form-item label="生日" prop="birthday">
                    <el-date-picker
                        v-model="form.birthday"
                        type="date"
                        :picker-options="pickerOptionsLessToday"
                        :disabled="dialogStatus=='view'"
                        value-format="yyyy-MM-dd"
                        :placeholder="dialogStatus=='view'?'':'请选择出生日期'"
                        style="width: 100%;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="form.address"  clearable :placeholder="dialogStatus=='view'?'':'请输入住址'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobilePhone">
                    <el-input v-model="form.mobilePhone" clearable :placeholder="dialogStatus=='view'?'':'请输入手机号码'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="telPhone">
                    <el-input v-model="form.telPhone" clearable :placeholder="dialogStatus=='view'?'':'请输入电话号码'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="form.email" clearable :placeholder="dialogStatus=='view'?'':'请输入邮箱地址'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="创建时间" prop="crtTime" v-if="dialogStatus=='view'">
                    <el-input v-model="form.crtTime" clearable :placeholder="dialogStatus=='view'?'':'请输入创建时间'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" clearable :placeholder="dialogStatus=='view'?'':'请输入描述信息'" :disabled="dialogStatus=='view'"></el-input>
                </el-form-item>
                <!--<el-form-item label="角色赋权" prop="birthday">
                  <treeselect v-model="form.groupIds" :options="optionsTree"  :multiple="true" search-nested :placeholder="dialogStatus=='view'?'':'请选择角色赋权'"/>
                </el-form-item>-->
            </el-form>
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
                rules: {

                },
                rulesPsw: {
                    newPsw: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 5, max: 20, message: '密码长度为5-20个字符', trigger: 'blur' }],
                    ckNewPsw: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }, { min: 5, max: 20, message: '密码长度为5-20个字符', trigger: 'blur' }],
                },
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
                    page: 1,
                    limit: 20,
                    orderBy: 'crtTime_descending',
                    name_LK_S: undefined,
                    username_LK_S: undefined,
                    description_LK_S: undefined,
                    updTime_GE_DT: undefined,
                    updTime_LE_DT: undefined
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
            getList() {

            },

            handleFilter() {  // 搜索事件
                this.listQuery.page = 1;
                this.getList();
            },
            handleReset() {  // 清空搜索框
                this.resetForm();
                this.getList();
            },
            handleSizeChange(val) { // 分页变化-当前页显示条数
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {  // 分页变化-翻页
                this.listQuery.page = val;
                this.getList();
            },
            handleCreate() {  // 添加用户按钮
                this.resetTemp(); // 清除旧数据
                this.dialogStatus = 'create'; // 定义弹窗为“新增”
                this.dialogFormVisible = true;
            },
            handleView(row) {

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
                if (str == 'name') { this.listQuery.name_LK_S = undefined; }
                if (str == 'username') { this.listQuery.username_LK_S = undefined; }
                if (str == 'description') { this.listQuery.description_LK_S = undefined; }
                if (str == 'updTime_GE_DT') { this.listQuery.updTime_GE_DT = undefined; }
                if (str == 'updTime_LE_DT') { this.listQuery.updTime_LE_DT = undefined; }
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
                this.listQuery.name_LK_S = undefined;
                this.listQuery.username_LK_S = undefined;
                this.listQuery.description_LK_S = undefined;
                this.listQuery.updTime_GE_DT = undefined;
                this.listQuery.updTime_LE_DT = undefined;
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

