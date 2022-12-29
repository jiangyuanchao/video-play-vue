import axios from 'axios'
import Vue from 'vue'
//导入路由
import router from '../router/index'

//处理响应信息的响应拦截器

/*上面已经导入了axios的对象了，这个对象里面有个响应的拦截器axios.interceptors.response.use(),use里面的data是服务端响应给你的数据，
该拦截器有两个回调函数，一个是success，一个是error,和jQuery里面的ajax一样请求数据的时候也有两个回调函数，一个success，一个error,
可以简单的理解为http的响应码是200的，它会进入到success方法中来，400以上的会进入到error来
*/
axios.interceptors.response.use(success => {
    //success.status: http的响应码   
    //success.data.status == 500: 返回json的status
    if (success.status && success.status == 200 && success.data.status == 500) {
        //把后台的消息打印出来
        console.log(success.data.message)
        return;
    }
    if (success.data.msg) {
        //把操作成功的信息也打印出来
        console.log(success.data.message)
    }
    return success.data
}, error => { //失败的处理
    //服务器返回的错误信息
    if (error.response.data.message) {
        Vue.prototype.$message({ message: error.response.data.message, type: 'error' })
    } else {
        Vue.prototype.$message({ message: '未知错误', type: 'error' })
    }
    return;
})


//封装请求
// let base = 'http://172.18.148.1'; //请求的服务器地址

export const addVideo = (params) => {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: '/app/internal/v3/download/video/task/add',
        data: params  //这是用json来传递的，所以不用加transformRequest转换了
    })
}
export const infoVideo = (params) => {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: '/plv/internal/v3/download/video/task/info',
        data: params  //这是用json来传递的，所以不用加transformRequest转换了
    })
}
export const reVideo = (params) => {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        url: '/app/internal/v3/download/video/task/execute',
        data: params  //这是用json来传递的，所以不用加transformRequest转换了
    })
}


// 布谷接口
// 任务提交入库
export const sdVideo = (params) => {
    return axios({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        url: '/api/ProcessVideo/SubmitDownload',
        data: params  //这是用json来传递的，所以不用加transformRequest转换了
    })
}
// 获取任务列表
export const listVideo = (params) => {
    return axios.get('/api/ProcessVideo/QueryDownloadRecords',{params: params})
}
// 获取任务列表
export const UpdateVideo = (params) => {
    return axios.get('/api/ProcessVideo/UpdateBatchStatus',{params: params})
}
export const getToken = (params) => {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: 'post',
        url: 'acc/service/v1/token',
        data: params  //这是用json来传递的，所以不用加transformRequest转换了
    })
}