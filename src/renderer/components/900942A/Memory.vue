<template>
    <!--内存页面-->
    <div class="wrap">
        <div class="out-p content-label">
          {{$t('Memory.lists.MemoryAllocation.title')}}
        </div>
        <!--循环渲染-->
        <div v-for="(dl,divIndex) in domList" :key="divIndex" class="for-main">
            <el-select size="mini" v-model="dl.defaultIndex" placeholder="请选择" class="sel-main"
                       @visible-change="changeList($event,dl.defaultIndex,divIndex)" ref="domMark" @change="getCol(dl.defaultIndex,divIndex)">
                <!--@blur="changeList($event,index)"-->
                <el-option
                        v-for="(item,index) in dl.selectableList"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.id"
                        :disabled="false"
                >
                </el-option>
            </el-select>
            <p>*</p>
            <el-select size="mini" v-model="dl.num" placeholder="请选择" class="sel" @visible-change="setNu(divIndex)" @change=" setNum(dl.defaultIndex,divIndex,dl.num)">
                <el-option
                        v-for="(item,ind) in dl.numX"
                        :key="ind"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>

            <button type="button" @click="delList(divIndex)" v-show="domList.length>1?1:0"
                    class="el-button interior-butt el-button--info el-button--mini is-circle"><i
                    class="el-icon-close"></i></button>

            <div class="pdiv" v-if="dl.temponTit!=null">
                {{dl.temponTit}}
            </div>
            <div class="pdiv red-a" v-if="dl.uiStatus">
                {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
            </div>
            <div class="pdiv" v-if="dl.setTimeMe">
                此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
            </div>
        </div>

        <div class="addline">
            <el-button size="mini" icon="el-icon-plus" @click="addMem" :disabled="forbid"></el-button>
            <span class="add-cables">{{$t('Memory.lists.MemoryAllocation.content1')}}</span>
        </div>
        <div>
            <p class="memory">{{$t('Memory.lists.MemoryAllocation.content2')}} <span class="rabbet"><span>{{value}}</span> / {{CPUCnt==1?16:32}}</span></p>
        </div>
        <!--<div class="out-p content-label">
          激活配置
        </div>-->
        <div class="block">
            <!--<span class="demonstration">自定义初始值</span>-->
            <!--<el-slider v-model="allnummin" :max="allnum"></el-slider>-->
        </div>
        <!--<ul>-->
        <!--<li @click="getList()">已激活：<span>{{allnum}}GB</span></li>-->
        <li>{{$t('Memory.lists.MemoryAllocation.content3')}}：<span>{{allnum}}GB</span></li>
        <!--</ul>-->
    </div>
</template>

<script>
// 引入模块
import jq from 'jquery';
export default {
  name: 'Memory',
  components: {
    // MemoryList,
  },
  data() {
    return {
      brr: [ 1 ],
      allMemories: [], // 全部内存列表
      selectedMemories: [], //  已选的内存列表
      selectableMemories: [], // 可选的内存列表
      domList: [], // 页面展示的下拉组件列表
      oldMemId: 0,
      oldDivIndex: 0,


      line: 50, // 激活线
      rabbet: 0,
      rabbet2: 0,
      forbid: false, // 按钮禁用
      value: 0, // 内存
      options: [],
      ids: [], // ID
      capacity: [], // 储存量
      ind: 0, // 该级储存
      showList: true, // 判断显示

      allnum: 0, // 所有层级已激活总数据
      allnummin: 50, // 所有层级已激活总数据

      MEMnum: '', // 内存最大数
      MAXnums: [],
      MaxNum: '', // 最大数

      detailnum: 2, // List数量

      mainFnArr: [], // 增删改查使用
      // off: false, // 禁止

      // activate: '',
      timesnew: '',
      createKID: '',
      keyID: '',
      CPUCnt: 1, // 默认为一
      productId: 1,
      lists: '',

      // 方案页面展示数据源
      showLists: [],
      // 方案数据中的所有productid
      productIds: [],
      addnowdata: [],
      HowShow: null,
      num:0,//标记，第一次进入页面不执行
    };
  },
  methods: {
      getkuS(){
          const SQL = `select  cm.*,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status,so.ship_date from component_memory cm
       join component_base_info info on info.id=cm.base_info_id
    join product_info product on product.id = info.productId
    join relation_solution_product relation on relation.product_id=product.id
    join solution so on so.id=relation.solution_id where info.productId='${localStorage.productId}' and so.id='${localStorage.solutionId}'`;
          this.$db.all(SQL, (err, res) => {
              if (err) {
                  this.$logger(err);
                  this.$Notice.error({
                      title: '获取数据失败',
                      desc: err,
                  });
              } else {
                  res.forEach((item,index)=>{
                      this.$set(item,'temponTit',item.title_msg) //展示的描述
                      if(item.withdraw_date){
                          let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                          let time = new Date(thisTime).getTime();//将时间改为时间戳
                          this.$set(res[index],'time',time)//将时间戳添加到对象里面
                          this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                          //如果不为null的话,就改为天数
                          this.$store.commit('setStatusTime',item.withdraw_date)
                          this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                      }else{
                          this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                          this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                      }
                      this.$store.commit('uiStatusTime',item.ui_status)
                      this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                      this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                      this.domList.forEach((it,ind)=>{
                          if(res.length==index+1){
                              this.domList[ind].selectedList=res
                              this.domList[ind].selectableList=res
                          }
                          if(item.id==it.id){
                              this.domList[ind].setTimeMe=item.withdraw_date
                              this.domList[ind].overdueTime=item.overdueTime
                              this.domList[ind].temponTit=item.temponTit
                              this.domList[ind].uiStatusEn=item.uiStatusEn
                              this.domList[ind].uiStatus=item.uiStatus

                          }
                      })
                  });
                  [ ...this.allMemories ] = res;
                  [ ...this.selectableMemories ] = res;
                  console.log(this.domList)
              }
          });
      },
    async getDataList() {
      // 获取所选产品支持的全部内存列表
      const than = this;
      const SQL = `select  cm.*,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status,so.ship_date from component_memory cm
       join component_base_info info on info.id=cm.base_info_id
    join product_info product on product.id = info.productId
    join relation_solution_product relation on relation.product_id=product.id
    join solution so on so.id=relation.solution_id where productId='${localStorage.productId}' and so.id='${localStorage.solutionId}'`;
      await new Promise(function(resolve, reject) {
        than.$db.all(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '获取数据失败',
              desc: err,
            });
          } else {
              return  resolve(res)
          }
        });
      }).then(res => {
          res.forEach((item,index)=>{
              this.$set(item,'temponTit',item.title_msg) //展示的描述
              if(item.withdraw_date){
                  let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                  let time = new Date(thisTime).getTime();//将时间改为时间戳
                  this.$set(res[index],'time',time)//将时间戳添加到对象里面
                  this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                  //如果不为null的话,就改为天数
                  this.$store.commit('setStatusTime',item.withdraw_date)
                  this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
              }else{
                  this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                  this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
              }
              this.$store.commit('uiStatusTime',item.ui_status)
              this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
              this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
          });
          console.log(res);
        [ ...this.allMemories ] = res;
        [ ...this.selectableMemories ] = res;

        const obj = {
          divIndex: 0,
          selectedList: this.selectedMemories,
          selectableList: this.selectableMemories,
          defaultIndex: this.selectableMemories[0].id,
          num: 2,
          numX: this.MAXnums,
          id: '',
          showList: true,
          gbLis: this.selectableMemories[0].capacity,
        };
        this.domList.push(obj);
          console.log(res,this.domList)
        this.domList.forEach((item, i) => {
          this.value += item.num;
        });
        // console.log(res, than.domList);
      });// this.selectedMemories.push(res[0]);
    },
    delList(index) { // 点击删除
      if (this.domList[index].id) {
        const sql = `DELETE FROM product_programme_detail WHERE id = ${this.domList[index].id}`;
        this.$db.run(sql, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            this.value = 0;
            this.allnum = 0;
            console.log(res, '删除成功');
            this.domList.splice(index, 1);
            this.brr.splice(index, 1);
            this.domList.forEach(item => {
              this.value += item.num;
              this.allnum += (item.num * item.gbLis);
            });
          }
        });
      } else {
        this.value = 0;
        this.allnum = 0;
        this.domList.splice(index, 1);
        this.domList.forEach(item => {
          this.value += item.num;
          this.allnum += (item.num * item.gbLis);
        });
      }
    },
    setNu(index) {
      console.log(this.domList[index].numX);
      let num = 0;
      this.domList.forEach((item, i) => {
        if (index !== i) {
          num += item.num;
        }
      });
      console.log(num, this.domList[index].numX);
      this.domList[index].numX = this.MAXnums.filter((item, i) => {
        if ((this.CPUCnt == 1 ? 16 : 32) - num >= item) {
          return true;
        }
      });
      this.$forceUpdate();
      // console.log(num, this.allnum, this.value);
      if (this.value <= this.CPUCnt) { // 判断内存的数量是否有误
        console.log('内存数量正确');
      } else {
        this.error = '内存里的选项有误';
        this.$emit('erro', 16);
      }
    },
    setNum(id, index, num) {
      this.value = 0;
      this.domList.forEach((item, i) => {
        this.value += item.num;
      });
      this.setState(id, index, num);
    },
    // 获取CPU和内存的关系列表
    async getMax() {
      const than = this;
      const MaxSum = `select cm.memory_cnt from cpu_memory cm left join component_cpu cc on cc.id=cm.cpu_id where cm.cpu_cnt=${this.CPUCnt}`;
      let numMax = '';
      await new Promise(function(resolve, reject) {
        than.$db.all(MaxSum, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            resolve(res);
          }
        });
      }).then(res => {
        console.log(res);
        this.MAXnums = [];
        for (let i = 0; i < res.length; i++) { // 取出选用数量并赋值给数组
          this.MAXnums.push(res[i].memory_cnt);
          numMax = res[res.length - 1].memory_cnt;
          this.MaxNum = numMax;
        }
        console.log(this.MaxNum, this.MAXnums);
        console.log(this.domList);
      });
    },
    addMem() { // 添加下拉选组件并限制可添加最大数
      if (this.domList[this.domList.length - 1].id == 0 && this.domList.length !== 1) {
        return;
      }
      if (this.domList.length > 4) { // 当多于最后一个选项的时候禁止
        return;
      }
      let num = 0;
      this.domList.forEach((item, i) => { // num为变值判断
        num += item.num;
      });
      if (num+this.MAXnums[0] >= (this.CPUCnt == 1 ? 16 : 32)) { // 大于最大值跳出
        return;
      }
      this.getCol(this.domList[this.domList.length - 1].defaultIndex, this.domList.length - 1, 1);
      const resValue = this.allMemories.filter(item => {
        let num = true;
        for (let j = 0; j < this.brr.length; j++) {
          if (this.brr[j] == item.id) {
            return num = false;
          }
        }
        return num;
      });
      // console.log(resValue);
      const obj = {
        divIndex: this.domList.length,
        // selectedList: this.selectedMemories,
        selectableList: resValue,
        defaultIndex: resValue[0].id,
        num: this.MAXnums[0],
        numX: this.MAXnums,
        id: '',
        showList: false,
        gbLis: resValue[0].capacity,
        temponTit:resValue[0].temponTit, //展示的描述
        overdueTime:resValue[0].overdueTime, //展示的描述
        uiStatusEn:resValue[0].uiStatusEn,//中文的描述
        uiStatus:resValue[0].uiStatus,//英文的描述
        setTimeMe:resValue[0].withdraw_date,//英文的描述
      };
      this.domList.push(obj);
      console.log('》》》》》》》》》》', this.domList, obj);
      // console.log(this.domList[0].selectableList);
      // }else{
      //     this.forbid = true;
      // }
      this.value = 0;
      this.allnum = 0;
      this.domList.forEach((item, i) => {
        this.value += item.num;
        this.allnum += (item.num * item.gbLis);
      });
      this.getCol(this.domList[this.domList.length - 1].defaultIndex, this.domList.length - 1);
      this.changeList(1, this.domList[this.domList.length - 1].id, this.domList.length - 1);
    },
    getCol(id, index, boll) {
      if (this.brr.length > index) {
        this.brr.forEach((item, i) => {
          if (index == i) {
            return this.brr[i] = id;
          }
        });
      } else {
        this.brr.push(id);
      }
      this.value = 0;
      this.allnum = 0;
      this.domList.forEach((item, i) => {
        this.value += item.num;
        this.allnum += (item.num * item.gbLis);
      });
      if (!boll) {
        console.log('判断执行');
        this.setState(id, index, this.domList[index].num);// this.MAXnums[0]
      }

      // console.log(this.brr, id, this.domList[index].selectableList);
    },
    setState(ind, index, num) { // 数据库存储数据
      console.log(ind, index, num, this.Clkadd);
      if (this.domList[index].id) {
        const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                ${ind}' where id=${this.domList[index].id}`;
        this.$db.run(updateSql, (err, res) => {
          if (res) {
            console.log('修改失败');
          } else {
            let gbLis = 0;
            this.selectableMemories.forEach(ite => {
              if (ite.id == ind) {
                gbLis = ite.capacity;
              }
            });
            this.domList[index].gbLis = gbLis;
            this.value = 0;
            this.allnum = 0;
            this.domList.forEach((item, i) => {
              this.value += item.num;
              this.allnum += (item.num * item.gbLis);
            });
            console.log('修改成功', this.domList[index].gbLis);
          }
        });
      } else {
        const time = new Date().getTime();
        const SQL = `INSERT INTO product_programme_detail
    ('product_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','machine_id')VALUES('${localStorage.productId}','2','${ind}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
        this.$db.run(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '数据获取失败',
              desc: err,
            });
          } else {
            if (res) {
              console.log('添加失败');
            } else {
              console.log('添加成功' + JSON.stringify(res));
              const selectSql = `select * from product_programme_detail where seq_Key=${time}`;
              this.$db.get(selectSql, (err, res) => {
                if (err) {
                  this.$logger(err);
                  this.$Notice.error({
                    title: '系统错误',
                    desc: err,
                  });
                  return;
                }
                this.domList[index].id = res.id; // id赋值判断
                console.log(this.domList[index].id);
                console.log(this.domList);
              });
            }
          }
        });
      }
    },
    // setDefaultState(ind, index, num) { // 数据库存储数据
    //   console.log(ind, index, num, this.Clkadd);
    //   const time = new Date().getTime();
    //   const SQL = `INSERT INTO product_programme_detail
    // ('product_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')VALUES('1','2','${ind}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
    //   this.$db.run(SQL, (err, res) => {
    //     if (err) {
    //       this.$logger(err);
    //       this.$Notice.error({
    //         title: '数据获取失败',
    //         desc: err,
    //       });
    //     } else {
    //       if (res) {
    //         console.log('添加失败');
    //       } else {
    //         console.log('添加成功' + JSON.stringify(res));
    //         const selectSql = `select * from product_programme_detail where seq_Key=${time}`;
    //         this.$db.get(selectSql, (err, res) => {
    //           if (err) {
    //             this.$logger(err);
    //             this.$Notice.error({
    //               title: '系统错误',
    //               desc: err,
    //             });
    //             return;
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    async getList() { // 数据库取出渲染
      const SQL = `select detail.id,detail.component_count,detail.component_id,info.status from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.category_id=2

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}' and detail.template_id=${localStorage.templateId} and detail.product_id='${localStorage.productId}'`;
      // console.log('sad');
      await this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          if (res.length == 0) {
            console.log(this.domList);
            if (this.domList[0].id) {
              console.log('qqqqqqq');
              return;
            }
            this.getCol(this.domList[0].defaultIndex, 0);

          } else {
            this.value = 0;
            this.brr = [];
            console.log(res);
            res.forEach((item, index) => {
              if (index >= 0) {
                this.domList.push({ ...this.domList[0] });
                this.domList[index].showList = false;
              }
              this.domList[index].id = item.id;
              this.domList[index].num = item.component_count;
              this.domList[index].defaultIndex = item.component_id;
                this.domList[index].selectableList.forEach(it=>{
                    if(item.component_id==it.id){
                        this.$set(this.domList[index],'temponTit',it.temponTit) //展示的描述
                        this.$set(this.domList[index],'overdueTime',it.overdueTime) //展示的描述
                        this.$set(this.domList[index],'uiStatusEn',it.uiStatusEn)//中文的描述
                        this.$set(this.domList[index],'uiStatus',it.uiStatus)//英文的描述
                        this.$set(this.domList[index],'setTimeMe',it.withdraw_date)//英文的描述
                    }
                })
              let gbLis = 0;
              this.selectableMemories.forEach(ite => {
                if (ite.id == item.component_id) {
                  gbLis = ite.capacity;
                }
              });
                this.selectableList=[...this.selectableMemories]
              this.domList[index].gbLis = gbLis;
              this.value += item.component_count;
              this.brr.push(item.component_id);
              this.allnum += (item.component_count * gbLis);
              this.$forceUpdate();
            });
            this.domList.pop();
            console.log(this.domList, res, this.selectableMemories);
          }

        }
      });
    },
    changeList(e, id, index) {
      if (e) {
          let gettime= new Date().getTime() //获取现在的时间戳
        const resValue = this.allMemories.filter((item,ind) => {
          let num = true;
            console.log(gettime,item.time)
            if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                return false //如果时间小于现在时间，也就说过市了，不在显示
            }
          for (let j = 0; j < this.brr.length; j++) {
            if (this.brr[j] == item.id && j != index) {
              return num = false;
            }
          }
          return num;
        });
        this.domList[index].selectableList = [ ...resValue ];
        // this.domList[index].defaultIndex=resValue[0].id
        this.$forceUpdate();
      }
    },
    // setdefault() {
    //   const len = this.domList.length;
    //   let num = 0;
    //   for (let i = 0; i < this.domList.length; i++) {
    //     num++;
    //   }
    //   console.log('>>>>>>>>>>>>>>>>>>>>>>', len, this.domList, num);
    //   if (len <= 1) {
    //     this.setDefaultState(1, 0, 2);
    //   }
    // },
  },
  async created() {
    // 生命周期执行渲染数据
    const than = this;
    await new Promise(function(resolve, reject) {
      const getCpu = `select component_count from product_programme_detail where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and category_id=3`;
      than.$db.get(getCpu, (err, res) => { // 获取库里面的类型
        if (err) {
          console.log('报错');
        } else {
          return resolve(res);
        }
      });
    }).then(res => {
      console.log(res);
      than.CPUCnt = res ? res.component_count : 1;
      than.$store.commit('setCPU', this.CPUCnt);
      console.log(111111, res, this.CPUCnt);
      // console.log(this.CPUCnt, this.$store.state.cpu_C);
    });
    await this.getMax();
    await this.getDataList();
    await this.getList(); // 取出渲染


    // this.getMaxsum();
    // this.defaultList();
  },
    async beforeRouteEnter(from, to, next) { // 箭头指向
   next(vm => {
      vm.CPUCnt = vm.$store.state.cpu_C;
      const MaxSum = `select cm.memory_cnt from cpu_memory cm left join component_cpu cc on cc.id=cm.cpu_id where cm.cpu_cnt=${vm.$store.state.cpu_C}`;
      const numMax = '';
      if(vm.num){
          vm.getkuS()
      }
       vm.num+=1
      new Promise(function(resolve, reject) {
         vm.$db.all(MaxSum, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
               resolve(res);
          }
        });
      }).then( res => {
        console.log(res);
        let numMax = ''; // 清空缓存
        vm.MAXnums = []; // 清空缓存
        for (let i = 0; i < res.length; i++) {
          vm.MAXnums.push(res[i].memory_cnt);
          numMax = res[res.length - 1].memory_cnt;
          vm.MaxNum = numMax;
        }
        vm.domList.forEach((item,index) => {
          item.numX = [ ...vm.MAXnums ];
          if(item.num<item.numX[0]){
              item.num=item.numX[0]
              vm.setNum(item.defaultIndex,index,item.num)
          }
        });
        // vm.setdefault(); // 默认初始

      });
      vm.$emit('comup', from.query.id);
    });
  },
  // beforeRouteLeave(to, from, next) { // 判断是否有数据
  //   if (this.domList.length == 1 && this.domList[0].id == undefined) {
  //     // console.log('null');
  //     this.setState(1, 1, 2);
  //   }
  //   next();
  // },
};
</script>

<style scoped lang="scss">
    * {
        list-style: none;
    }

    .wrap {
        padding: 20px;
        .for-main {
            margin-top: 12px;
            padding-bottom: 10px;
        }
        .interior-butt {
            margin-left: 12px;
        }
        .memory {
            margin-top: 12px;
        }
        .out-p {
            width: 100%;

            p {
                height: 30px;
                line-height: 30px;
                width: 100%;
                margin-top: 12px;
                background: #f2f2f2;
                padding-bottom: 12px;
            }
        }
    }

</style>
