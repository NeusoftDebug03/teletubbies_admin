<template>
    <div style="width: 100%; height: 100%; margin-bottom: 20px;">
        <!--筛选搜索区-->
        <div class="search-wrapper">
            <el-form :inline="true">
                <el-form-item label="订单ID：">
                    <el-input
                        size="small"
                        v-model="searchParam.orderId"
                        placeholder="请输入要查询的订单ID"
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
                <el-table-column prop="orderId" label="订单ID" width="80"></el-table-column>
                <el-table-column prop="userId" label="用户ID" width="120"></el-table-column>
                <el-table-column prop="contentId" label="订单内容ID" width="120"></el-table-column>
                <el-table-column prop="cost" label="订单金额" width="120"></el-table-column>
                <el-table-column prop="statusId" label="订单状态" width="240"></el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            @click="getDetail(scope.row.orderId)"
                        >查看详情</el-button>
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
        <OrderDetails
            :visible.sync="visible"
            ref="detail"
        ></OrderDetails>
    </div>
</template>
<script>
import api from "../../api/api";
import OrderDetails from "./OrderDetails"
export default {
    components: {
        OrderDetails
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
            searchParam: {
                orderId: null,
                userId: null
            },
            visible:false,
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
        // 获取表格数据
        async getPageData() {
            this.loading = true;
            let params = {
                currentPage: this.pData.currentPage,
                pageSize: this.pData.pageSize,
                condition: {}
            };
            if (this.searchParam.orderId) {
                Object.assign(params.condition, {
                    orderId: this.searchParam.orderId
                });
            }
            if (this.searchParam.userId) {
                Object.assign(params.condition, {
                    userId: this.searchParam.userId
                });
            }
            try {
                let res = await api.order.queryOrdersFun(params);
                this.loading = false;
                this.tData.dataList = res.data.data.items;
                this.pData.total = res.data.data.totalNum;
            } catch (err) {
                console.log("获取订单列表失败," + err);
            }
        },
        query() {
            this.pData.currentPage = 1;
            this.getPageData();
        },
        getDetail(orderId){
             this.visible = true;
             this.$refs.detail.getdetail(orderId);
        }
    }
};
</script>
<style  scoped>
</style>
