<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 审核招聘信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="queryParams.recruitName" placeholder="招聘名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="recruitList"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="recruitId" label="招聘编号"></el-table-column>
                <el-table-column prop="recruitName" label="招聘名称"></el-table-column>
                <el-table-column prop="postName" label="岗位名称"></el-table-column>
                <el-table-column prop="postClaim" label="岗位需求"></el-table-column>
                <el-table-column prop="user.userName" label="申请人名称"></el-table-column>
                <el-table-column prop="num" label="招聘人数"></el-table-column>
                <el-table-column prop="status" label="审核状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status=='0'">未审核</p>
                        <p v-if="scope.row.status=='1'">审核成功</p>
                        <p v-if="scope.row.status=='2'">审核失败</p>
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
                                icon="el-icon-edit"
                                @click="handleExamine(scope.row)">批准通过</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleFail(scope.row)">不准通过</el-button>
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
                <el-form-item label="招聘人数" prop="num">
                    <el-input v-model="form.num"></el-input>
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
    import { listRecruit, editRecruit, getRecruit, editStatus } from '@/api/page/recruit';

    export default {
        name: 'recruit1',
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
                recruitList: null,
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
                    recruitId: undefined,
                    recruitName: undefined,
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
                listRecruit(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.recruitList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                })
            },

            reset() {
                this.form = {
                    id: undefined,
                    recruitId: undefined,
                    recruitName: undefined,
                    postName: undefined,
                    postClaim: undefined,
                    userId: undefined,
                    num: undefined,
                    status: undefined
                }
            },

            // 触发搜索按钮
            handleSearch() {
                this.queryParams.page = 1;
                this.getList()
            },
            // 审核通过操作
            handleExamine(row) {
                this.reset();
                // 二次确认
                this.$confirm('确定吗？', '提示', {
                    type: 'warning'
                }).then(function() {
                    return editStatus(row.id, 1);
                }).then(() => {
                    this.getList();
                })
                    .catch(function(){})
            },
            handleFail(row) {
                this.reset();
                // 二次确认
                this.$confirm('确定吗？', '提示', {
                    type: 'warning'
                }).then(function() {
                    return editStatus(row.id, 2);
                }).then(() => {
                    this.getList();
                })
                    .catch(function(){})
            },
            // 编辑操作
            handleEdit(row) {
                this.reset();
                const id = row.id;
                getRecruit(id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改人数"
                })
            },
            // 保存编辑
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                            editRecruit(this.form).then(response => {
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
