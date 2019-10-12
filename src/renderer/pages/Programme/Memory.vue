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
                        :label="item.mem_des"
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
    };
  },
  methods: {
    async getDataList() {
      // 获取所选产品支持的全部内存列表
      const than = this;
      const SQL = `select cm.* from component_memory cm left join product_memory pm on cm.id=pm.memory_id where product_id = ${this.productId}`;
      await new Promise(function(resolve, reject) {
        than.$db.all(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '获取数据失败',
              desc: err,
            });
          } else {
            resolve(res);
          }
        });
      }).then(res => {
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
          console.log('判断执行', res[i]);
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
      if (num >= (this.CPUCnt == 1 ? 16 : 32)) { // 大于最大值跳出
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
        num: 2,
        numX: this.MAXnums,
        id: '',
        showList: false,
        gbLis: resValue[0].capacity,
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
        this.setState(id, index, 2);
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
    ('product_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id','machine_id')VALUES('1','2','${ind}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
    // ('product_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id')VALUES('1','2','${ind}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
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
      const SQL = `select detail.id,detail.component_count,detail.component_id from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.categroy_id=2

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id=1 and machine_id='${localStorage.machineId}'`;
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
              let gbLis = 0;
              this.selectableMemories.forEach(ite => {
                if (ite.id == item.component_id) {
                  gbLis = ite.capacity;
                }
              });
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
        const resValue = this.allMemories.filter(item => {
          let num = true;
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
      const getCpu = 'select component_count from product_programme_detail where product_id=1 and categroy_id=3';
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
  beforeRouteEnter(from, to, next) { // 箭头指向
    next(vm => {
      vm.CPUCnt = vm.$store.state.cpu_C;
      const MaxSum = `select cm.memory_cnt from cpu_memory cm left join component_cpu cc on cc.id=cm.cpu_id where cm.cpu_cnt=${vm.$store.state.cpu_C}`;
      const numMax = '';
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
      }).then(res => {
        console.log(res);
        let numMax = ''; // 清空缓存
        vm.MAXnums = []; // 清空缓存
        for (let i = 0; i < res.length; i++) {
          vm.MAXnums.push(res[i].memory_cnt);
          numMax = res[res.length - 1].memory_cnt;
          vm.MaxNum = numMax;
          console.log('判断执行', res[i]);
        }
        vm.domList.forEach(item => {
          item.numX = [ ...vm.MAXnums ];
          console.log(item.numX);
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
