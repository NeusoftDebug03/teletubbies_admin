<template>
    <div style="width: 100%; height: 100%; margin-bottom: 20px;">
        <!--按钮操作区-->
        <div class="search-wrapper">
            <div class="button-left">
                <el-button
                    type="primary"
                    size="small"
                    @click="addEditProduct(addEditParam.params, 'add')"
                >添加商品</el-button>
            </div>
        </div>

        <!--筛选搜索区-->
        <div class="search-wrapper">
            <el-form :inline="true">
                <el-form-item label="商品ID：">
                    <el-input
                        size="small"
                        v-model="searchParam.productId"
                        placeholder="请输入要查询的商品ID"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品名字：">
                    <el-input
                        size="small"
                        v-model="searchParam.productName"
                        placeholder="请输入要查询的商品名字"
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
                <el-table-column prop="productId" label="商品ID" width="80"></el-table-column>
                <el-table-column prop="productName" label="名称" width="120"></el-table-column>
                <el-table-column prop="productLangs" label="网友评价" width="120"></el-table-column>
                <el-table-column prop="productIntro" label="简介" width="120"></el-table-column>
                <el-table-column prop="productDetails" label="描述" width="240"></el-table-column>
                <el-table-column prop="productExtraInfo" label="额外信息" width="120"></el-table-column>
                <el-table-column prop="productPrice" label="价格" width="80"></el-table-column>
                <el-table-column prop="productDiscount" label="折扣" width="80"></el-table-column>
                <el-table-column prop="productStock" label="库存" width="80"></el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            @click="addEditProduct(scope.row, 'revise')"
                        >修改</el-button>
                        <el-button
                            type="danger"
                            size="small"
                            plain
                            @click="deleteProduct(scope.row)"
                        >删除</el-button>
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
        <AddEditProduct
            :add-edit-param="addEditParam"
            :visible.sync="visible"
            @refresh="refreshPageData"
        ></AddEditProduct>
    </div>
</template>
<script>
import AddEditProduct from "./AddEditProduct";
import api from "../../api/api";
export default {
    components: {
        AddEditProduct
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
                    productName: "",
                    productLangs: "",
                    productIntro: "",
                    productDetails: "",
                    productExtraInfo: "",
                    productPrice: "",
                    productDiscount: "",
                    productStock: ""
                }
            },
            searchParam: {
                productId: null,
                productName: ""
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
        addEditProduct(row, action) {
            this.visible = true;
            this.addEditParam.action = action;
            this.addEditParam.params = JSON.parse(JSON.stringify(row));
        },
        //删除
        deleteProduct(row) {
            this.$confirm("确定要删除所选内容？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    let params = {
                        productId: row.productId
                    };
                    try {
                        let res = await api.product.deleteProductFun(params);
                        if (res.data.code == 1) {
                            this.$message.success("删除成功");
                            setTimeout(() => {
                                this.refreshPageData();
                            }, 300);
                        } else {
                            this.$alert("删除失败：" + res.data.msg);
                        }
                    } catch (error) {
                        this.$message.error(error);
                    }
                })
                .catch(() => {});
        },
        // 获取表格数据
        async getPageData() {
            this.loading = true;
            let params = {
                currentPage: this.pData.currentPage,
                pageSize: this.pData.pageSize,
                condition: {}
            };
            if (this.searchParam.productId) {
                Object.assign(params.condition, {
                    productId: this.searchParam.productId
                });
            }
            if (this.searchParam.productName) {
                Object.assign(params.condition, {
                    productName: this.searchParam.productName
                });
            }
            try {
                let res = await api.product.getProductsFun(params);
                this.loading = false;
                this.tData.dataList = res.data.data.items;
                this.pData.total = res.data.data.totalNum;
            } catch (err) {
                console.log("获取商品列表失败," + err);
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
