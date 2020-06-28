<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
            </div>
            <el-table
                    :data="equipList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="equipId" label="设备编号"></el-table-column>
                <el-table-column prop="equipName" label="设备名称"></el-table-column>
                <el-table-column prop="model" label="型号"></el-table-column>
                <el-table-column prop="fault" label="故障现象描述"></el-table-column>
                <el-table-column prop="guaranteeTime" label="报修时间"></el-table-column>
                <el-table-column prop="applicat" label="报修人姓名"></el-table-column>
                <el-table-column prop="personId" label="报修人编号"></el-table-column>
                <el-table-column prop="laboratory.laboratoryId" label="实验室名称"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleTable"
                        >导出</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                    v-show="total>10"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
            />
        </div>


        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="open" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="设备名称" prop="equipName">
                    <el-input v-model="form.equipName"></el-input>
                </el-form-item>
                <el-form-item label="型号" prop="model">
                    <el-input v-model="form.model"></el-input>
                </el-form-item>
                <el-form-item label="故障现象描述" prop="fault">
                    <textarea v-model="form.fault"></textarea>
                </el-form-item>
                <el-form-item label="申请时间" prop="guaranteeTime">
                    <el-date-picker
                            v-model="form.guaranteeTime"
                            type="date"
                            aria-placeholder="选择时间"
                            format="yyyy年MM月dd日 HH时mm分"
                            value-format="yyyy-MM-dd HH:mm"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="报修人姓名" prop="applicat">
                    <el-input v-model="form.applicat"></el-input>
                </el-form-item>
                <el-form-item label="助研员编号" prop="personId">
                    <el-input v-model="form.personId"></el-input>
                </el-form-item>
                <el-form-item label="实验室">
                    <el-select v-model="form.laboratoryId" placeholder="请选着">
                        <el-option
                                v-for="item in laboratoryOption"
                                :key="item.laboratoryId"
                                :value="item.laboratoryName"
                                :title="item.laboratoryId"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="open = false">取 消</el-button>
                <el-button type="primary" @click="getPdf()">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="title" :visible.sync="openAdd" width="90%">
            <table id="pdfDom" class="table1 table-striped table-bordered">
                <tr>
                    <td align="center" colspan="24">实验教学仪器设备维修申报表</td>
                </tr>
            <tr>
                <td class="column">报修过部门</td>
                <td class="value"></td>
                <td class="column" v-model="form.equipName">设备名称</td>
                <td class="value"></td>
                <td class="column">系、处、直属科领导盖章</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="column">设备所在科</td>
                <td class="value"></td>
                <td class="column" v-model="form.equipId">设备编号</td>
                <td class="value"></td>
                <td class="column">实验教学中心领导意见</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="column" v-model="form.applicat">报修人</td>
                <td class="value"></td>
                <td class="column" v-model="form.model">型号</td>
                <td class="value"></td>
                <td class="column">学院主管领导意见</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="column" v-model="form.guaranteeTime">报修日期</td>
                <td class="value"></td>
                <td class="column">所带附件</td>
                <td class="value"></td>
                <td class="column">审计部门意见</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="column" v-model="form.fault">故障现象</td>
                <td class="column-m1"></td>
                <td class="column">维修记录</td>
                <td class="value"></td>
                <td class="column">维修费</td>
                <td class="value"></td>
            </tr>
            <tr>
                <td class="column">实验教学中心设备科意见</td>
                <td class="value"></td>
                <td class="column">领回人</td>
                <td class="value"></td>
                <td class="column">领取时间</td>
                <td class="value"></td>
            </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="openAdd = false">取 消</el-button>
                <el-button type="primary" @click="getPdf()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { listEquip, editEquip, getEquip} from '@/api/page/equip';

    export default {
        name: 'equip1',
        data() {
            return {
                // 遮罩层
                loading: true,
                tableData: [],
                multipleSelection: [],
                delList: [],
                // 日期范围
                dateRange: [],
                // 设备表格数据
                equipList: null,
                // 总条数
                total: 0,
                //标题
                title: "",
                //实验室编号
                laboratoryOption: [],
                open: false,
                openAdd: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    equipId: undefined,
                    equipName: undefined,
                },
            };
        },
        created() {
            this.getList();
        },
        computed: {
            currentPage: {
                get() {
                    return this.page
                },
                set(val) {
                    this.$emit('update:page', val)
                }
            },
            pageSize: {
                get() {
                    return this.limit
                },
                set(val) {
                    this.$emit('update:limit', val)
                }
            }
        },
        methods: {
            getList() {
                this.queryParams.userId = localStorage.getItem('ms_username');
                listEquip(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.equipList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                })
            },

            reset() {
                this.form = {
                    equipId: undefined,
                    equipName: undefined,
                    model: undefined,
                    fault: undefined,
                    applicat: undefined,
                    guaranteeTime: undefined,
                    personId: undefined,
                    laboratoryId: undefined
                }
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const equipId = row.equipId;
                getEquip(equipId).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "导出报销表"
                })
            },
            handleTable(){
                this.openAdd = true;
                this.title = "实验室导出"
            },
            // 保存编辑
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                            editEquip(this.form).then(response => {
                                if (response.code == 200) {
                                    this.open = false;
                                    this.getList();
                                }
                            });
                    }
                })
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .table1 {
        border-collapse: collapse;
        border-spacing: 0;
        background-color: transparent;
        display: table;
        width: 100%;
        max-width: 100%;
        margin-bottom: 22px;
    }
    .table td {
        text-align:center;
        vertical-align:middle;
        font-size: 9px;
    }
    .table-bordered {
        border: 1px solid #ddd;
    }
    .column{
        width:100px;
        height:30px;
        border:1px solid #333;
    }
    .value{
        width:150px;
        height:30px;
        border:1px solid #333;
    }
    .column-m1{
        width: 400px;
        height: 30px;
        border:1px solid #333;
    }
</style>
