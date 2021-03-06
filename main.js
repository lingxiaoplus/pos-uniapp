import Vue from 'vue'
import App from './App'

// main.js
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// 引入插件import request from '@/components/request/request.js'// 全局配置request.setConfig({  baseUrl: "https://yangli.api.lingxiaomz.top", // 此为测试地址，需加入到域名白名单，或者更改为您自己的线上地址即可  //dataType: 'json', // 可删除，默认为json  //responseType: 'text', // 可删除，默认为text  // 设置请求头，支持所有请求头设置，也可不设置，去掉header就行  header: {    'token': 'token from global',    'content-type': 'application/x-www-form-urlencoded' ,  }})// 设置请求拦截器request.interceptors.request(config => {  // 配置参数和全局配置相同，此优先级最高，会覆盖在其他地方的相同配置参数  // 追加请求头，推荐  config.header['content-type'] = 'application/json';  let token = uni.getStorageSync("login-token");  if (token) {    console.log("获取到的token为",token);    config.header['login-token'] = token;  }  //config.header['content-type'] = 'application/x-www-form-urlencoded';  // config.header.token = 'token from interceptors';  // 覆盖请求头  // config.header = {    // 'content-type': 'application/json',    // 'token': 'token from interceptors'  // }  // return false; // 终止请求  // return Promise.reject('error from request interceptors'); // 向外层抛出错误，用catch捕获  return config; // 返回修改后的配置，如未修改也需添加这行})// 设置响应拦截器request.interceptors.response(res => {  // 接收请求，执行响应操作  // 您的逻辑......  //console.log("响应拦截器", res);  let token = res.header['login-token'];    if (token){      console.log("设置token",token);	  uni.setStorageSync("login-token",token)    }  if(res.statusCode == 403){	  //Toast.error('未登录，没有权限操作');
	  uni.showToast({
	  	title:'没有权限操作',
		icon:'none'
	  })	  console.log("没有权限操作");	  //return false;	  return Promise.reject('没有权限操作')  }
  if(res.statusCode == 401){
  	  uni.showToast({
  	  	title:'未登录',
  		icon:'none'
  	  })
	  uni.redirectTo({
	  	url:'/pages/user/login'
	  })
  	  console.log("未登录");
  	  return Promise.reject('未登录')
  }  // return false;    // 阻止返回,页面不会接收返回值  // return {message: '自定义值，来自拦截器'};   // 返回您自定义的值，将覆盖原始返回值  // return Promise.reject('error from response interceptors') // 向外层抛出错误，用catch捕获  return res; // 原样返回})// // 挂载到全局vue实例上，在页面中可以使用this.$request调用request实例下相应方法Vue.prototype.$request = request;

