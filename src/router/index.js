import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const constantRouterMap = [
    {
        path: ',',
        redirect: '/login'
    },
    {
        path: '/readme',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children:[
            {
                path: '/',
                component: resolve => require(['../components/page/Readme.vue'], resolve)
            },
            {
                path: '/homeg',
                component: resolve => require(['../components/page/Homeindex.vue'], resolve)
            },
            {
                path: '/userCenter',
                component: resolve => require(['../components/page/UserCenter.vue'], resolve)    // 拖拽列表组件
            },
            {
                path: '/userCenterall',
                component: resolve => require(['../components/page/UserCenterall.vue'], resolve)    // 拖拽列表组件
            },
            {
                path: '/modifyUser',
                component: resolve => require(['../components/page/ModifyUser.vue'], resolve)
            },
            {
                path: '/modifyPassword',
                component: resolve => require(['../components/page/ModifyPassword.vue'], resolve)
            },

        ]
    },
    {
        path: '/register',
        component: resolve => require(['../components/page/Register.vue'], resolve)
    },
    {
        path: '/register-success',
        component: resolve => require(['../components/page/RegisterSuccess.vue'], resolve)
    },
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '/viewOrder',
        component: resolve => require(['../components/common/Main.vue'], resolve),
        children:[{
            path: '/viewOrder',
            component: resolve => require(['../components/page/viewOrder/viewOrder.vue'], resolve)
        }]
    },
    {
        path: '/prodBrand',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children:[{
            path: '/product',
            component: resolve => require(['../components/page/product/product.vue'], resolve)
        },{
            path: '/prodBrand',
            component: resolve => require(['../components/page/product/prodBrand.vue'], resolve)
        }]
    },
    {
        path: '/shop',
        component: resolve => require(['../components/common/Main.vue'], resolve),
        children:[{
            path: '/shop',
            component: resolve => require(['../components/page/shop/shop.vue'], resolve)
        },{
            path: '/productImg',
            component: resolve => require(['../components/page/product/productImg.vue'], resolve)
        }]
    },
    {
        path: '/viewOrder',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children:[{
            path: '/viewOrder',
            component: resolve => require(['../components/page/viewOrder/viewOrder.vue'], resolve)
        }]
    },
]


export default new Router({
    routes:constantRouterMap
})
