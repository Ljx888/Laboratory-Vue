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
                <el-input v-model="queryParams.postName" placeholder="岗位名" class="handle-input mr10"></el-input>
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
                <el-table-column prop="userId" label="学号"></el-table-column>
                <el-table-column prop="user.userName" label="申请人名称"></el-table-column>
                <el-table-column prop="applyTime" label="申请时间"></el-table-column>
                <el-table-column prop="recruitId" label="招聘编号"></el-table-column>
                <el-table-column prop="status" label="审核状态">
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
                                class="red"
                                @click="handleAdd(scope.row)"
                        >添加为助研员</el-button>
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
                <el-form-item label="助研员编号" prop="personId">
                    <el-input v-model="form.personId"></el-input>
                </el-form-item>
                <el-form-item label="学号" prop="userId">
                    <el-input v-model="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名" prop="userName">
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
                <el-form-item label="专业" prop="major">
                    <el-input v-model="form.major"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="clazz">
                    <el-input v-model="form.clazz"></el-input>
                </el-form-item>
                <el-form-item label="年级" prop="grade">
                    <el-input v-model="form.grade"></el-input>
                </el-form-item>
                <el-form-item label="实验室">
                    <el-select v-model="form.laboratoryId" placeholder="请选着">
                        <el-option
                                v-for="item in personOption"
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
    import { listTc } from '@/api/page/enroll';
    import { input, addPerson } from '@/api/page/person';

    export default {
        name: 'enroll3',
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
                personOption: [],
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
                    status: undefined
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
                this.queryParams.status = 2;
                listTc(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
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
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 编辑操作
            handleAdd(row) {
                this.reset();
                const userId = row.userId;
                input(userId).then(response => {
                    this.form = response.data;
                    this.personOption = response.lab;
                    this.open = true;
                    this.title = "添加助研员"
                })
            },
            // 保存编辑
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid){
                            addPerson(this.form).then(response => {
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
