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
};

// 改变VUX全局方法
const mutations = {
  updatedata(state){
    state.data=[];
  },
    getdata(state, parm){
        state.data.push(parm)
    },
    setdata(state, [index,num]){
        // console.log(state.data[index],index,num);
        state.data[index].count=num;  // 判断数量参数
        state.data[index].all_price = state.data[index].list_price * num;
        state.data[index].sale_untax = num * (state.data[index].list_price * (100 - state.data[index].discount)/100); // 计算价格总量
        state.data[index].sale_tax = num * (state.data[index].list_price * (100-state.data[index].discount)/100); // 未税价格总量
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
