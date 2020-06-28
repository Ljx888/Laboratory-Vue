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
                <el-input v-model="queryParams.laboratoryName" placeholder="实验室名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                    :data="labList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="laboratoryId" label="实验室编号"></el-table-column>
                <el-table-column prop="laboratoryName" label="实验室名称"></el-table-column>
                <el-table-column prop="user.userName" label="用户名称"></el-table-column>
                <el-table-column prop="type.typeName" label="实验室类型"></el-table-column>
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
                <el-form-item label="学院教务处编号" prop="initTeachId">
                    <el-input v-model="form.laboratoryId"></el-input>
                </el-form-item>
                <el-form-item label="学院教务处名称" prop="initTeachName">
                    <el-input v-model="form.laboratoryName"></el-input>
                </el-form-item>
                <el-form-item label="用户类型">
                    <el-select v-model="form.userId" placeholder="请选择">
                        <el-option
                                v-for="item in userOption"
                                :key="item.userId"
                                :value="item.userId"
                                :title="item.userName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="实验室类型">
                    <el-select v-model="form.typeId" placeholder="请选着">
                        <el-option key="1" label="公共实验室" value="001"></el-option>
                        <el-option key="2" label="基础实验室" value="002"></el-option>
                    </el-select>
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
                <el-form-item label="学院教务处编号" prop="initTeachId">
                    <el-input v-model="form.laboratoryId"></el-input>
                </el-form-item>
                <el-form-item label="学院教务处名称" prop="initTeachName">
                    <el-input v-model="form.laboratoryName"></el-input>
                </el-form-item>
                <el-form-item label="实验室助研员">
                    <el-select v-model="form.userId" placeholder="请选着">
                        <el-option
                                v-for="item in userOption"
                                :key="item.userId"
                                :value="item.userId"
                                :title="item.userName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="实验室类型">
                    <el-select v-model="form.typeId" placeholder="请选着">
                        <el-option key="1" label="公共实验室" value="001"></el-option>
                        <el-option key="2" label="基础实验室" value="002"></el-option>
                    </el-select>
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
    import {listLab, addLab, editLab, inputLab, getLab, deleteLab} from '../../../api/page/laboratory';

    export default {
        name: 'laboratory',
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
                labList: null,
                // 总条数
                total: 0,
                //标题
                title: "",
                // 用户类型
                userOption: [],
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
                    laboratoryId: undefined,
                    laboratoryName: undefined,
                },
            };
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                listLab(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.labList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                })
            },

            reset() {
                this.form = {
                    laboratoryId: undefined,
                    laboratoryName: undefined,
                    typeId: undefined
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
                    return deleteLab(row.laboratoryId);
                }).then(() => {
                    this.getList();
                })
                    .catch(function(){})
            },
            handleAdd() {
                this.reset();
                inputLab().then(response => {
                    this.userOption = response.users;
                    this.openAdd = true;
                    this.title = "添加"
                })
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const id = row.laboratoryId;
                getLab(id).then(response => {
                    this.form = response.data;
                    this.userOption = response.users;
                    this.open = true;
                    this.title = "修改用户"
                })
            },
            //保存添加
            submitAdd: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        addLab(this.form).then(res => {
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
                        editLab(this.form).then(response => {
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
