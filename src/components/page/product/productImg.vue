<!--商品管理页面-->
<template>
    <div class="app-container">
        <!--搜索栏-->

        <!--表格-->

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

