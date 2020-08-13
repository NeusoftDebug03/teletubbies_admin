<template>
    <div style="width: 100%; height: 100%; margin-bottom: 20px;">
        <!--按钮操作区-->
        <div class="search-wrapper">
            <div class="button-left">
                <el-button
                    type="primary"
                    size="small"
                    @click="addEditUser(addEditParam.params, 'add')"
                >添加用户</el-button>
            </div>
        </div>

        <!--筛选搜索区-->
        <div class="search-wrapper">
            <el-form :inline="true">
                <el-form-item label="用户名：">
                    <el-input
                        size="small"
                        v-model="searchParam.username"
                        placeholder="请输入要查询的用户名"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="用户ID：">
                    <el-input
                        size="small"
                        v-model="searchParam.userId"
                        placeholder="请输入要查询的用户ID"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="昵称：">
                    <el-input
                        size="small"
                        v-model="searchParam.name"
                        placeholder="请输入要查询的昵称"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="手机号：">
                    <el-input
                        size="small"
                        v-model="searchParam.phoneNumber"
                        placeholder="请输入要查询的手机号"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!--表格操作区-->
        <div class="table-wrapper">
            <el-table
                border
                :data="tData.dataList"
                :height="tData.tHeight"
                v-loading="loading"
                class="my-table"
            >
                <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
                <el-table-column prop="username" label="用户名" width="120"></el-table-column>
                <el-table-column prop="passwd" label="密码" width="120"></el-table-column>
                <el-table-column prop="balance" label="余额" width="120"></el-table-column>
                <el-table-column prop="name" label="昵称" width="120"></el-table-column>
                <el-table-column prop="phoneNumber" label="手机号码" width="120"></el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" plain @click="addEditUser(scope.row, 'revise')">修改</el-button>
                        <el-button type="danger" size="small" plain @click="deleteUser(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--分页区-->
        <div class="pager-wrapper">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pData.currentPage"
                :page-sizes="pData.pageSizes"
                :page-size="pData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pData.total"
            ></el-pagination>
        </div>
        <AddEditUser
            :add-edit-param="addEditParam"
            :visible.sync="visible"
            @refresh="refreshPageData"
        ></AddEditUser>
    </div>
</template>
<script>
import AddEditUser from "./AddEditUser";
import api from "../../api/api";
export default {
    components: {
        AddEditUser
    },
    data() {
        return {
            loading: false, // 表格数据加载缓冲
            deleteDis: true, // 删除按钮禁用标志
            tData: {
                dataList: [],
                tHeight: 0
            },
            // 分页数据
            pData: {
                total: 0,
                currentPage: 1,
                pageSize: 10,
                pageSizes: [10]
            },
            visible: false, // 增查改素材内容弹框
            //增改传参
            addEditParam: {
                action: "",
                params: {
                    username: "",
                    passwd: "",
                    balance: null,
                    name: "",
                    phoneNumber: ""
                }
            },
            searchParam: {
                userId: null,
                username: "",
                name: "",
                phoneNumber: ""
            }
        };
    },
    created() {
        this.init();
    },
    mounted() {
        // 自动调整表格区高度
        let _this = this;

        //加定时器，不然高度渲染0
        setTimeout(() => {
            autoResize();
        }, 0);

        window.onresize = autoResize;

        function autoResize() {
            let wh = +window.innerHeight,
                tHeight = wh - 255;
            _this.tData.tHeight = tHeight;
        }
    },
    methods: {
        init() {
            this.getPageData();
        },
        refreshPageData() {
            this.getPageData();
        },
        // 当前页码变化
        handleCurrentChange(currentPage) {
            this.pData.currentPage = currentPage;
            this.getPageData();
        },
        // 当前页大小变化
        handleSizeChange(size) {
            this.pData.pageSize = size;
            this.getPageData();
        },
        //增查改
        addEditUser(row, action) {
            this.visible = true;
            this.addEditParam.action = action;
            this.addEditParam.params = JSON.parse(JSON.stringify(row));
        },
        //删除
        deleteUser(row) {
            this.$confirm("确定要删除所选内容？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    let params = {
                        userId:row.userId
                    }
                    try {
                        let res = await api.user.deleteUserFun(params);
                        if(res.data.code == 1){
                            this.$message.success("删除成功");
                            setTimeout(() => {
                                this.refreshPageData();
                            }, 300);
                        }else{
                            this.$alert("删除失败：" + res.data.msg);
                        }
                    } catch (error) {
                        this.$message.error(error);
                    }
                })
                .catch(()=>{});
        },
        // 获取表格数据
        async getPageData() {
            this.loading = true;
            let params = {
                currentPage: this.pData.currentPage,
                pageSize: this.pData.pageSize,
                condition:{}
            };
            if(this.searchParam.userId){
                Object.assign(params.condition, {
                    userId: this.searchParam.userId
                });
            }
             if(this.searchParam.username){
                Object.assign(params.condition, {
                    username: this.searchParam.username
                });
            }
             if(this.searchParam.name){
                Object.assign(params.condition, {
                    name: this.searchParam.name
                });
            }
             if(this.searchParam.phoneNumber){
                Object.assign(params.condition, {
                    phoneNumber: this.searchParam.phoneNumber
                });
            }
            try {
                // console.log(params)
                let res = await api.user.getUserListFun(params);
                this.loading = false;
                this.tData.dataList = res.data.data.items;
                this.pData.total = res.data.data.totalNum;
            } catch (err) {
                console.log("获取用户列表失败," + err);
            }
        },
        query() {
            this.pData.currentPage = 1;
            this.getPageData();
        }
    }
};
</script>
<style  scoped>
</style>
