import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/user',
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            children: [
                // {
                //     path: '/dashboard',
                //     component: () => import('../components/common/DashBoard.vue'),
                //     meta: {
                //         title: '系统首页',
                //         requireAuth: true // 判断是否需要登录 
                //     }
                // },
                {
                    path: '/user',
                    component: () => import('../components/usermanage/UserMng.vue'),
                    meta: {
                        title: '用户管理',
                        requireAuth: true
                    }
                },
                {
                    path: '/query',
                    component: () => import('../components/ordermanage/OrderMng.vue'),
                    meta: {
                        title: '订单查询',
                        requireAuth: true
                    }
                },
                {
                    path: '/product',
                    component: () => import('../components/productmanage/ProductMng.vue'),
                    meta: {
                        title: '商品管理',
                        requireAuth: true
                    }
                },
            ]
        },
        {
            path: '/login',
            component: () => import('../components/common/Login.vue'),
            meta: {
                title: '登录'
            }
        }

    ]
});