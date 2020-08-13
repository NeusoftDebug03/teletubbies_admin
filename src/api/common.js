import service from './axios'

export const requestOfPost = function(url,data){
    return new Promise((resolve,reject) =>{
        service.post(url,data)
        .then(res=>{
            resolve(res);
        })
        .catch(err=>{
            reject(err);
        })
    })
};

export const requestOfGet = function(url,data){
    return new Promise((resolve,reject) =>{
        service.get(url,{
            params:data
        })
        .then(res=>{
            resolve(res);
        })
        .catch(err=>{
            reject(err);
        })
    })
};