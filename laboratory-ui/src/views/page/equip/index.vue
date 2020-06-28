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
                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>
                <el-input v-model="queryParams.equipName" placeholder="设备名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
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
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.row)"
                        >删除</el-button>
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
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { listEquip, addEquip, inputEquip, getEquip, editEquip, deleteEquip, delAll} from '@/api/page/equip';

    export default {
        name: 'equip',
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
                this.queryParams.personId = localStorage.getItem('ms_username');
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

            // 触发搜索按钮
            handleSearch() {
                this.queryParams.page = 1;
                this.getList()
            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(function() {
                    return deleteEquip(row.equipId);
                }).then(() => {
                    this.getList();
                })
                    .catch(function(){})
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].equipId + ',';
                }
                this.$confirm('确定删除吗？', '提示', {
                    type: 'warning'
                }).then(function() {
                    return delAll(str);
                }).then(() => {
                    this.getList();
                })
                    .catch(function() {})
                this.multipleSelection = [];
            },
            handleAdd() {
                this.reset();
                inputEquip().then(response => {
                    this.laboratoryOption = response.data;
                    this.open = true;
                    this.title = "添加报修信息"
                })
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const equipId = row.equipId;
                getEquip(equipId).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改报销表"
                })
            },
            // 保存编辑
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                        if (this.form.equipId != undefined ) {
                            editEquip(this.form).then(response => {
                                if (response.code == 200) {
                                    this.open = false;
                                    this.getList();
                                }
                            });
                        } else {
                            addEquip(this.form).then(response => {
                                if (response.code == 200) {
                                    this.open = false;
                                    this.getList();
                                }
                            });
                        }
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

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
</style>
