<template>
    <div>
        <el-dialog
            :title="'订单详细信息'"
            :visible.sync="visible"
            :close-on-click-modal="false"
            :before-close="close"
            width="660px"
        >
            <el-table
                border
                :data="detailData.order"
                class="my-table"
            >
                <el-table-column prop="orderId" label="订单ID" width="120"></el-table-column>
                <el-table-column prop="userId" label="用户ID" width="120"></el-table-column>
                <el-table-column prop="contentId" label="订单内容ID" width="120"></el-table-column>
                <el-table-column prop="cost" label="订单金额" width="120"></el-table-column>
                <el-table-column prop="statusId" label="订单状态" width="139"></el-table-column>
            </el-table>
            <br/>
            <el-table
                border
                :data="detailData.user"
                class="my-table"
            >
                <el-table-column prop="userId" label="用户ID" width="80"></el-table-column>
                <el-table-column prop="username" label="用户名" width="120"></el-table-column>
                <el-table-column prop="passwd" label="用户密码" width="100"></el-table-column>
                <el-table-column prop="balance" label="余额" width="80"></el-table-column>
                <el-table-column prop="name" label="昵称" width="120"></el-table-column>
                 <el-table-column prop="phoneNumber" label="电话号码" width="119"></el-table-column>
            </el-table>
            <br/>
            <el-table
                border
                :data="detailData.contents"
                class="my-table"
            >
                <el-table-column prop="contentId" label="订单内容ID" width="200"></el-table-column>
                <el-table-column prop="productId" label="购买的商品ID" width="200"></el-table-column>
                <el-table-column prop="count" label="购买数量" width="219"></el-table-column>
            </el-table>
            <br/>
            <el-table
                border
                :data="detailData.status"
                class="my-table"
            >
                <el-table-column prop="statusId" label="状态ID" width="200"></el-table-column>
                <el-table-column prop="statusName" label="状态名称" width="200"></el-table-column>
                <el-table-column prop="statusDesc" label="状态描述" width="219"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import api from "../../api/api"
export default {
    props: ["visible"],
    data() {
        return {
            detailData:{
                order:[],
                user:[],
                contents:[],
                status:[]
            }
        }
    },
    methods: {
        close() {
            this.$emit("update:visible", false);
            this.detailData = {
                order:[],
                user:[],
                contents:[],
                status:[]
            }
        },
        async getdetail(orderId){
            try {
                let params = {
                    orderId: orderId
                };
                let res = await api.order.getOrderDetailFun(params);
                this.detailData.order.push(res.data.data.order);
                this.detailData.user.push(res.data.data.user);
                this.detailData.contents = res.data.data.contents;
                this.detailData.status.push(res.data.data.status);
            } catch (error) {
                console.log('获取详情失败');
            }
        }
    },
}
</script>
<style scoped>

</style>