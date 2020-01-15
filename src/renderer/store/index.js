import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

const state = {
  ProAnchor: '',
  backplaneId: '',
  cpu_C: 1,
  allMemory: 0,
  solutionId: 0,
  sourceData: '',
  machine: 0,
  allNum: 0,
  allNums: 0,
  data:[],
  MachineName:"",
  userId:localStorage.userId,
  info_language:0,//用来控制获取到的数据中英文切换的，0为中文，1为英文
  language:0,//用来控制本地的数据中英文切换的，0为中文，1为英文
  showWithdraw:0,//用来控制本地的数据是否展示过期组件，0为是，1为否
  tax:0,//增值税，
  currency_type:0,//货币种类0是人民币，1为美元
  statusTime:{},//要展示的内容
  overdueTime:0//展示的还有多少天过期
};

// 改变VUX全局方法
const mutations = {
  //展示的还有多少天过期，过期了就展示为0
  setStatusTime(state,num){
    //将过期时间的-转为/
    let taty=new Date(num.replace(/-/g, "/"))
    //将过期时间转为时间戳-当前的时间戳
    let date=taty.getTime()-new Date().getTime()
    if(date>0){
      state.overdueTime=Math.ceil(date/(1000*60*24*60))
    }else{
      state.overdueTime=0
    }
  },
  //展示的过不过期的提示信息提示信息
  uiStatusTime(state,num){
    let obj={}
    if(num==0){
      obj.uiStatus=''
      obj.uiStatusEn=''
    }else if(num==1){
      obj.uiStatus='此部件预计3~5周供货'
      obj.uiStatusEn=' part is expected to be delivered in 3~5 weeks'
    }else if(num==2){
      obj.uiStatus='此部件预计5~8周供货'
      obj.uiStatusEn='part is expected to be delivered in 5~8 weeks'
    }else if(num==3){
      obj.uiStatus='此部件预计>8周供货'
      obj.uiStatusEn='part is expected to be delivered within >8 weeks'
    }
    state.statusTime=obj
  },
  updateLanguage(state,[key,sum]){
    state[key]=sum
  },
  changeMachineName(state, [index,name]){ // 判断机器名改变触发
      state.data[index].remark_name = name
      console.log(name);
  },
  updatedata(state){
    state.data=[];
  },
    getdata(state, parm){
        state.data.push(parm)
    },
    setdata(state, [index,num]){
         console.log(state.data[index],index,num);
        state.data[index].count=num;  // 判断数量参数
        state.data[index].all_price = Math.round(state.data[index].list_price * num*100)/100; //列表价
        state.data[index].sale_untax = Math.round(num * state.data[index].list_priceOff*100)/100; // 计算价格总量 未税
        state.data[index].all_priceMe = Math.round(state.data[index].list_priceMe * num*100)/100; //列表价 美元
        state.data[index].sale_untaxMe = Math.round(num * state.data[index].list_priceOffMe*100)/100; // 计算价格总量 未税 美元

    },
  setdatadiscount(state, [index,tax]){
    console.log(state.data[index].tax)
    state.data[index].sale_taxMe = Math.round(state.data[index].sale_untaxMe*(100+state.tax))/100;// 计算价格总量  含税
    state.data[index].sale_tax = Math.round(state.data[index].sale_untax*(100+state.tax))/100; // 含税价格总量
  },
  getIds1() {
    state.ProAnchor = 'proInt';
  },
  getIds2() {
    state.ProAnchor = 'proDes';
  },
  getIds3() {
    state.ProAnchor = 'priSta';
  },
  getSourceData(state, num) {
    state.sourceData = num;
  },
  setCPU(cpuNUM, parm) {
    console.log(cpuNUM, parm);
    cpuNUM.cpu_C = parm;
    // if (cpuNUM === 1) {
    //     console.log('第一种模式')
    // } else if (cpuNUM === 2) {
    //     console.log('第二种模式')
    // }
  },
  setMEM(state, memNum) { // 抛出内存容量到全局
    state.allMemory = memNum;
  },
  changeMachine(state, machine) { // 抛出机器总量
    console.log(machine);
    state.machine = machine;
  },
  getsolutionId(state, solutionId) { // 抛出solutionId
      console.log(solutionId)
      state.solutionId = solutionId;
  }
};

const store = new Vuex.Store({
  modules,
  state,
  strict: process.env.NODE_ENV !== 'production',
  mutations,
});

export default store;
