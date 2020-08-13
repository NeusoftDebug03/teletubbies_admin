import axios from 'axios';

//获取token
function getToken(){
    let token = localStorage.getItem('token')||'';
    return token;
}

//创建axios实例
const service = axios.create({
	baseURL:'http://127.0.0.1:8282/',
    timeout:12*1000
})

//设置request请求拦截器
service.interceptors.request.use(
    config =>{
        if(getToken()){
            //让每个请求头都带上token，这里暂时没有这个需求
            // config.headers['token'] = getToken();
        }
        return config;
    },
    error =>{
        Promise.reject(error);

    }
)

//设置respose响应拦截器
service.interceptors.response.use(
    response =>{
        // let res = response.data;
        //这里可以加入状态码的判断，暂时没这需求
        return Promise.resolve(response);
    },
    error =>{
        return Promise.reject(error);
    }
)

export default service;
