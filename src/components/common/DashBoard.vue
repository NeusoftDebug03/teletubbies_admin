<template>
    <div>
        <el-row>
            
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    created() {
        if(localStorage.getItem('ms_username')){
            console.log("已登录");
        }else{
            this.$router.push({path:'/login'});
        }
    },
}
</script>
<style scoped>

</style>