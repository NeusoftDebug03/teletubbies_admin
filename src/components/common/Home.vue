<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from "./Header";
import vSidebar from "./Sidebar";
import bus from "../../bus";

export default {
    beforeRouteEnter(to, from, next) {
        if (localStorage.getItem("ms_username")) {
            next();
        } else {
            next("/login");
        }
    },
    data() {
        return {
            collapse: false
        };
    },
    components: {
        vHead,
        vSidebar
    },
    created() {
        bus.$on("collapse-content", msg => {
            this.collapse = msg;
        });
    }
};
</script>
