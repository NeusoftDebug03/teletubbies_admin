import {requestOfPost,requestOfGet} from './common'

const apiUrl = {
    getUserList:'/api/conditional_query_users',
    addUser:'/api/add_user',
    modifyUser:'/api/modify_user',
    deleteUser:'/api/del_user',
    getProducts:'/api/query_products',
    deleteProduct:'/api/del_product',
    addProduct:'/api/add_product',
    modifyProduct:'/api/modify_product',
    queryOrders:'/api/queryOrders',
    saleInfo:'/api/sale_info',
    getOrderDetail:'/api/get_order_detail'

}

const api = {
    user:{
        getUserListFun(data){
            return requestOfPost(apiUrl.getUserList,data);
        },
        addUserFun(data){
            return requestOfPost(apiUrl.addUser,data);
        },
        modifyUserFun(data){
            return requestOfPost(apiUrl.modifyUser,data);
        },
        deleteUserFun(data){
            return requestOfPost(apiUrl.deleteUser,data);
        }
    },
    product:{
        getProductsFun(data){
            return requestOfPost(apiUrl.getProducts,data);
        },
        deleteProductFun(data){
            return requestOfPost(apiUrl.deleteProduct,data);
        },
        addProductFun(data){
            return requestOfPost(apiUrl.addProduct,data);
        },
        modifyProductFun(data){
            return requestOfPost(apiUrl.modifyProduct,data);
        }
    },
    order:{
        queryOrdersFun(data){
            return requestOfPost(apiUrl.queryOrders,data);
        },
        saleInfoFun(){
            return requestOfGet(apiUrl.saleInfo);
        },
        getOrderDetailFun(data){
            return requestOfPost(apiUrl.getOrderDetail,data);
        }
    }
}

export default api;