//对axios进行二次封装:使用请求和拦截器
import axios from "axios";
import {ElMessage} from "element-plus"
//引入用户相关的仓库
import useUserStore from "@/store/modules/user"

//第一步：利用axios对象的create方法，去创建axios实例(其他的配置：基础路径，超时时间)
let request = axios.create({
    //基础路径
    baseURL: import.meta.env.VITE_APP_BASE_API,//基础路径会携带/api
    timeout: 5000//超时的时间设置
});
//第二步：request实例添加请求与相应拦截器
request.interceptors.request.use((config) => {
    //获取用户相关的小仓库，获取仓库内部token，登录成功以后携带给服务器 
    let userStore = useUserStore();
    if(userStore.token){
        config.headers.token=userStore.token
    }
    //config配置对象，headers属性请求头，经常给服务器端携带公共的参数
    //返回配置对象
    return config;
});
//第三步，配置相应拦截器
request.interceptors.response.use((response) => {
    //成功的回调
    //简化数据
    return response.data
}, (error) => { 
    //失败回调：处理http网络错误
    //定义一个变量，存储网络错误信息
    let message=''
    //http状态码
    let status=error.response.status
    switch(status){
        case 401:
            message="token过期"
            break;
        case 403:
            message="无权访问"
            break;
        case 404:
            message="请求地址错误"
            break;
        case 500:
            message="服务器死亡"
            break;
        default:
            message="网络问题"
    }
    //提示错误信息
    ElMessage({
        type:'error',
        message
    });
    return Promise.reject(error)
})
//对外暴露
export default request