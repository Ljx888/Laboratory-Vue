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
                <el-input v-model="queryParams.userName" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table
                    :data="userList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="userId" label="用户编号"></el-table-column>
                <el-table-column prop="userName" label="用户名"></el-table-column>
                <el-table-column prop="telephone" label="电话号码"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="role.roleName" label="角色名称"></el-table-column>
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
                <el-form-item label="用户编号" prop="userId">
                    <el-input v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="telephone">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="open=false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {listUser, getUser, addUser, editUser, deleteUser, deleteUserAll} from '../../../api/page/user';

    export default {
        name: 'user',
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
                userList: null,
                // 总条数
                total: 0,
                //标题
                title: "",
                open: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    userId: undefined,
                    userName: undefined,
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
                listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.userList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                })
            },

            reset() {
                this.form = {
                    id: undefined,
                    userId: undefined,
                    userName: undefined,
                    telephone: undefined,
                    password: undefined,
                    email: undefined
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
                    return deleteUser(row.userId);
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
                    str += this.multipleSelection[i].userId + ',';
                }
                this.$confirm('确定删除吗？', '提示', {
                    type: 'warning'
                }).then(function() {
                    return deleteUserAll(str);
                }).then(() => {
                    this.getList();
                })
                    .catch(function() {})
                this.multipleSelection = [];
            },
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加用户"
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const id = row.id;
                getUser(id).then(response => {
                  this.form = response.data;
                  this.open = true;
                  this.title = "修改用户"
                })
            },
            // 保存编辑
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                        if (this.form.id != undefined ) {
                             editUser(this.form).then(response => {
                                 if (response.code == 200) {
                                     this.open = false;
                                     this.getList();
                                 }
                             });
                        } else {
                            addUser(this.form).then(response => {
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
