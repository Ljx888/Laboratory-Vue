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
                <el-input v-model="queryParams.postName" placeholder="岗位名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="enrollList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="enrollId" label="招聘编号"></el-table-column>
                <el-table-column prop="postName" label="岗位名称"></el-table-column>
                <el-table-column prop="skill" label="技能描述"></el-table-column>
                <el-table-column prop="user.userName" label="申请人名称"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间"></el-table-column>
                <el-table-column prop="recruitId" label="招聘编号"></el-table-column>
                <el-table-column prop="status" label="面试状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status=='-1'">未审核</p>
                        <p v-if="scope.row.status=='0'">未通过</p>
                        <p v-if="scope.row.status=='1'">进入面试</p>
                        <p v-if="scope.row.status=='2'">成为助理</p>
                        <p v-if="scope.row.status=='3'">面试失败</p>
                    </template>
                </el-table-column>
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
                <el-form-item label="技能需求" prop="skill">
                    <textarea v-model="form.skill"></textarea>
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
    import {listEnroll, editEnroll, deleteEnroll, getEnroll} from '../../../api/page/enroll';

    export default {
        name: 'enroll',
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
                enrollList: null,
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
                    id: undefined,
                    enrollId: undefined,
                    postName: undefined,
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
                listEnroll(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.enrollList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                })
            },

            reset() {
                this.form = {
                    enrollId: undefined,
                    skill: undefined
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
                    return deleteEnroll(row.id);
                }).then(() => {
                    this.getList();
                })
                    .catch(function(){})
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const id = row.id;
                getEnroll(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改申请内容"
                })
            },
            // 保存编辑
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                            editEnroll(this.form).then(response => {
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
