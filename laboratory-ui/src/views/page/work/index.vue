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
                <el-input v-model="queryParams.id" placeholder="编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                    :data="workList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="weekly" label="周次"></el-table-column>
                <el-table-column prop="workTime" label="工作时间"></el-table-column>
                <el-table-column prop="week" label="星期"></el-table-column>
                <el-table-column prop="workList" label="工作内容"></el-table-column>
                <el-table-column prop="systemTime" label="系统时间"></el-table-column>
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

        <!--添加弹出框-->
        <el-dialog :title=title :visible.sync="openAdd" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="周次" prop="weekly">
                    <el-input v-model="form.weekly"></el-input>
                </el-form-item>
                <el-form-item label="工作时间" prop="workTime">
                    <el-date-picker
                            v-model="form.workTime"
                            type="date"
                            aria-placeholder="选择时间"
                            format="yyyy年MM月dd日"
                            value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="星期" prop="week">
                    <el-input v-model="form.week"></el-input>
                </el-form-item>
                <el-form-item label="助研员编号" prop="personId">
                    <el-input v-model="form.personId"></el-input>
                </el-form-item>
                <el-form-item label="工作内容" prop="workList">
                    <textarea v-model="form.workList"></textarea>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="openAdd = false">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog :title="title" :visible.sync="open" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="工作内容" prop="workList">
                    <textarea v-model="form.workList"></textarea>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="open = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { listWork, addWork, editWork, getWork ,deleteWork, deleteAll} from '@/api/page/work';

    export default {
        name: 'work',
        data() {
            return {
                // 遮罩层
                loading: true,
                tableData: [],
                multipleSelection: [],
                delList: [],
                // 日期范围
                dateRange: [],
                // 用户表格数据
                workList: null,
                // 总条数
                total: 0,
                //标题
                title: "",
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
                    id: undefined,
                    personId: undefined
                },
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.queryParams.personId = localStorage.getItem('ms_username');
                listWork(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.workList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                })
            },

            reset() {
                this.form = {
                    id: undefined,
                    weekly: undefined,
                    personId: undefined,
                    workTime: undefined,
                    week: undefined,
                    workList: undefined
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
                    return deleteWork(row.id);
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
                    str += this.multipleSelection[i].id + ',';
                }
                this.$confirm('确定删除吗？', '提示', {
                    type: 'warning'
                }).then(function() {
                    return deleteAll(str);
                }).then(() => {
                    this.getList();
                })
                    .catch(function() {})
                this.multipleSelection = [];
            },
            handleAdd() {
                this.reset();
                this.openAdd = true;
                this.title = "添加"
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const id = row.id;
                getWork(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改工作内容"
                })
            },
            //保存添加
            submitAdd: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        addWork(this.form).then(res => {
                            if (res.code == 200) {
                                this.openAdd = false;
                                this.getList();
                            }
                        });
                    }
                })
            },
            // 保存编辑
            submitEdit: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                        editWork(this.form).then(response => {
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
