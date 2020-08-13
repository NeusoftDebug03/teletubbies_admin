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
                <el-form-item label="商品名" prop="productName">
                    <el-input v-model="input.productName" size="small" placeholder="请输入商品名"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="网友评价" prop="productLangs">
                    <el-input v-model="input.productLangs" size="small" placeholder="请输入网友评价"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="简介" prop="productIntro">
                    <el-input v-model="input.productIntro" size="small" placeholder="请输入简介"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="描述" prop="productDetails">
                    <el-input v-model="input.productDetails" size="small" placeholder="请输入描述"></el-input>
                </el-form-item>
                <br />
                <el-form-item label="额外信息" prop="productExtraInfo">
                    <el-input v-model="input.productExtraInfo" size="small" placeholder="请输入额外信息"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="productPrice">
                    <el-input v-model="input.productPrice" size="small" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="折扣" prop="productDiscount">
                    <el-input v-model="input.productDiscount" size="small" placeholder="请输入折扣"></el-input>
                </el-form-item>
                <el-form-item label="库存" prop="productStock">
                    <el-input v-model="input.productStock" type="number" size="small" placeholder="请输入库存"></el-input>
                </el-form-item>
                <!-- <el-form-item label="类别" prop="productClass">
                    <el-input v-model="input.productClass" size="small" placeholder="请输入类别"></el-input>
                </el-form-item> -->
                <el-form-item label="类别">
                    <el-select v-model="input.productClass" placeholder="请选择商品类型" size="mini">
                        <el-option label="妈妈专区" value="妈妈专区"></el-option>
                        <el-option label="宝宝专区" value="宝宝专区"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片">
                  <el-upload
                    class="avatar-uploader"
                    action=""
                    accept="image/jpeg,image/gif,image/png"
                    :show-file-list="false"
                    :on-change="onUploadChange"
                    :auto-upload="false">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="" width="100%" height="100%" style="z-index: 11;">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过500kb</div>
                  </el-upload>
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
            input: {},
            imageUrl: ''
        };
    },
    created () {
    },
    computed: {
        title() {
            if (this.addEditParam.action === "add") return "添加商品信息";
            else return "修改商品信息";
        }
    },
    methods: {
        close() {
            this.$refs["form"].resetFields();
            this.$emit("update:visible", false);
            this.addEditParam.params = {
                productName:"",
                productLangs:"",
                productIntro:"",
                productDetails:"",
                productExtraInfo:"",
                productPrice:"",
                productDiscount:"",
                productStock:""
            };
        },
        async confirm() {
            if (this.checkContent(this.input)) {
                let params = this.input;
                console.log(params);
                try {
                    let res = {};
                    if(this.addEditParam.action == "add"){
                        res = await api.product.addProductFun(params);
                    }else{
                        res = await api.product.modifyProductFun(params);
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
        },
        async submitUpload (file) {
            // var that = this;
            // let formData = new FormData();
            // formData.append('img', file);
            // formData.append('productId', this.input.productId);
            // console.log(this.input.productId);
           
            // let config = {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // };
            // this.$http.post('/upload_product_img', formData, config).then(function (res) {
            //         if (res.code !== '1') {
            //             console.log(res);
            //             return that.$message.error('上传商品图片失败！')
            //         }
            //     }
            // );
            const { data: res } = await this.$http.post('/upload_product_img_base', {
                productId: this.input.productId,
                img: file
            })
            if (res.code !== '1') {
                return this.$message.error('图片上传失败！')
            }
            this.$message.success('上传成功！')
            this.imageUrl = res.data
        },
        async onUploadChange (file) {
          const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png' || file.raw.type === 'image/gif');
          const isLt1M = file.size / 1024 / 1024 < 10;
          if (!isIMAGE) {
            this.$message.error('上传文件只能是图片格式!');
            return false
          }
          if (!isLt1M) {
            this.$message.error('上传图片大小不能超过 10M!');
            return false
          }
          // 转base64格式

        //   this.submitUpload(file)
          var that = this
          var reader = new FileReader();
          reader.readAsDataURL(file.raw);
          reader.onload = function () {
            // _this.imageUrl = this.result
            that.submitUpload(this.result)
          }
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

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
</style>
