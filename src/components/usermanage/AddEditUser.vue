<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="visible"
            :close-on-click-modal="false"
            :before-close="close"
            width="660px"
        >
            <el-form
                :model="input"
                :inline="true"
                ref="form"
                class="my-form"
                label-position="right"
                label-width="auto"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="input.username" size="small" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="密码" prop="passwd">
                    <el-input v-model="input.passwd" size="small" placeholder="请输入密码"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="余额" prop="balance">
                    <el-input v-model.number="input.balance" size="small" placeholder="请输入余额"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="input.name" size="small" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="手机号码" prop="phoneNumber">
                    <el-input v-model="input.phoneNumber" size="small" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <br />
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm">确定</el-button>
                <el-button @click="close">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from "../../api/api";

export default {
    props: ["visible", "addEditParam"],
    watch: {
        addEditParam: {
            handler: function(val) {
                this.input = val.params;
            },
            deep: true
        }
    },
    data() {
        return {
            input: {}
        };
    },
    computed: {
        title() {
            if (this.addEditParam.action === "add") return "添加用户";
            else return "修改用户";
        }
    },
    methods: {
        close() {
            this.$refs["form"].resetFields();
            this.$emit("update:visible", false);
            this.addEditParam.params = {
                username: "",
                passwd: "",
                balance: null,
                name: "",
                phoneNumber: ""
            };
        },
        async confirm() {
            if (this.checkContent(this.input)) {
                let params = this.input;
                console.log(params);
                try {
                    let res = {};
                    if(this.addEditParam.action == "add"){
                        res = await api.user.addUserFun(params);
                    }else{
                        res = await api.user.modifyUserFun(params);
                    }
                    if (res.data.code == 1) {
                        this.$message.success(
                            this.addEditParam.action === "add"
                                ? "添加成功"
                                : "修改成功"
                        );
                        this.close();
                        this.$emit("refresh");
                    } else {
                        this.$alert(
                            (this.addEditParam.action === "add"
                                ? "添加失败："
                                : "修改失败：") + res.data.msg
                        );
                    }
                } catch (error) {
                    this.$message.error(error);
                }
            } else {
                this.$alert("内容不能为空");
            }
        },
        checkContent(params) {
            for (let key in params) {
                if (params[key] == null || !params[key]) {
                    return false;
                }
            }
            return true;
        }
    }
};
</script>
<style scoped>
.common-width {
    width: 500px;
}

.my-form /deep/ label {
    width: 80px;
}

.my-form {
    margin: 5px 120px;
}

.el-form-item {
    margin: 5px 10px;
}
</style>
