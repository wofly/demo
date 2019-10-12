<template>
    <!--内部PCIe-->
    <div class="interior-pcle">
        <div class="interior-hea content-label"> 内部PCIe设置</div>
        <div class="interior-pei for-main" v-for="(ite,ind) in arr" :key="ind">
            <el-select v-model="ite.interiorVal"  size="mini"
                       @change="getPcie(ite.interiorVal,ind)" ref="interiorVal" class="sel">
                <el-option
                        v-for="(item,index) in ite"
                        :key="item.pcie_type"
                        :label="item.pcie_type"
                        :value="index">
                </el-option>
            </el-select>
            <el-select v-model="ite.value" :placeholder="ite.optionsVal" size="mini"
                       @change="recor(ite.value,ind,1)" @visible-change="getRec($event,ind,ite.value)">
                <el-option
                        v-for="(item,index) in ite.options"
                        :key="item.PCI_E_desc_cn"
                        :label="item.PCI_E_desc_cn"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-select v-model="ite.interiorDow" placeholder="1" size="mini"
                       @change="recor(ite.value,ind,ite.interiorDow)" @visible-change="getList($event,ind)" class="sel">
                <el-option
                        v-for="item in ite.num"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="mini" type="info" icon="el-icon-close" circle class="interior-butt"
                       v-show="arr.length>1?1:0" @click="deletePci(ite.value,ind)"></el-button>
        </div>
        <div class="interior-pic">
            <el-button icon="el-icon-plus" size="mini" @click="addCard()"></el-button>
            增加板卡
        </div>
        <div class="interior-pic">
            已使用插槽 {{x8_4+x8_3+x16_4}} / {{cpuNum}}
        </div>
        <div class="interior-hea content-label"> 提示信息</div>
        <div class="interior-bott">
        </div>
    </div>
</template>

<script>
export default {
  name: 'InteriorPcle',
  data() {
    return {
      cpuNum: 8,
      cpu: 1, // 暂时写为cpu的数量
      interiorTop: [], // 动态获取卡的值
      pcieS: '', // 动态获取的最大数
      arr: [],//循环渲染的数据
      brr: [],//记录选过的值
      id: 1,
      x16_4: 0, // 默认的值cpu为一时
      x8_4: 0, // 默认的值cpu为一时
      x8_3: 0, // 默认的值cpu为一时
      pciNum: 1,
      name_id: '',
      sign:''
    };
  },
  methods: {
    all(index, fun) {//获取库里的多条数据
      const SQL = index;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          fun(res, err);
        }
      });
    },
    getPcie(index, ind) { // 根据前面获取去的数据，动态获取要展示的数据
      this.arr[ind].interiorDow = 1;
      const cpieC = `select info.description PCI_E_desc_cn,io.PCI_E_generation,io.PCI_E_size,io.id from component_iocard io left join component_base_info info on io.base_info_id=info.id where io.PCI_Catagory_id=${index + 1}`;
      this.all(cpieC, res => { // 选卡时的事件
        // 动态获取配置的选项
        res.filter((item, i) => {//获取到数据后，
          for (let j = 0; j < this.brr.length; j++) {//brr里面记录过的，就把他删除掉，因为上面已经选择过了
            if (item.id == this.brr[j]&&ind!=i) {
              return false;
            }
            return true;
          }
        });
       console.log(this.x16_4, this.x8_4, this.x8_3);
        this.arr[ind].options = [ ...res ];//这个是后面具体展示的内容
        this.arr[ind].optionsAl = [ ...res ];//这个是最原始的内容，操作的时候操作他，再给options赋值
        this.getRec(1,ind,this.arr[ind].value)//过滤一遍
        this.arr[ind].value = this.arr[ind].options.length == 0 ? '没有可以匹配的' : this.arr[ind].options[0].id;// 默认展示第一个值,如果没有值显示没有匹配的
        this.brr.splice(ind, 1);//点击前面的时候，把brr里面的数据删掉，
        // this.arr[ind].optionsVal = resValue == 0 ? '没有可以匹配的' : res[0].PCI_E_desc_cn;// 默认展示第一个值,如果没有值显示没有匹配的
        this.arr[ind].splice(9, 0);// 触发刷新页面
          this.recor(this.arr[ind].value,ind,1)//这个是选择类型后，重新往库里提交一条数据
      });

    },
    getRec(value, ind, index) {//点击选择框时的操作
      if (value) {//如果为true的时候为打开选择框，
        // 动态获取配置的选项
        let resValue = this.arr[ind].optionsAl.filter(item => {//过滤一遍，已经有了的不显示在选择框内
          let num = true;
          for (let j = 0; j < this.brr.length; j++) {
            if (this.brr[j] == item.id && item.id != index) {
              return num = false;
            }
          }
          return num;
        });
        let blNum=[0,0,0];//这个是如果选择完了，再次回去选择的话就为空，因为都选过了，所以把点击的这个记录下来，
          if (this.arr[ind].PCI_E_size == 1 && this.arr[ind].PCI_E_generation != 4) {
              blNum[2]=this.arr[ind].interiorDow
          }
          if (this.arr[ind].PCI_E_size == 1 && this.arr[ind].PCI_E_generation == 4) {
              blNum[1]=this.arr[ind].interiorDow
          }
          if (this.arr[ind].PCI_E_size == 2) {
              blNum[0]=this.arr[ind].interiorDow
          }
        if (this.x16_4- blNum[0]>= (this.cpu == 1 ? 1 : 3)) {//点击自己时把自己去掉
          resValue = resValue.filter((item, i) => {
            if (item.PCI_E_size == 2) {// 如果数量够了，就不再显示
              return false;
            }
            return true;

          });
        }
        if (this.x8_4- blNum[1] >= (this.cpu == 1 ? 1 : 2)) {//点击自己时把自己去掉
          resValue = resValue.filter((item, i) => {
            if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {// 如果数量够了，就不再显示
              return false;
            }
            return true;

          });
        }
        if(this.x8_4){//这个是判断x8_4有没有值，有的话执行，没有的话else
            if(this.cpu==1&&this.x8_4>=1){
                if (this.x8_3 -blNum[2]-blNum[1] >= 6) {//点击自己时把自己去掉
                    resValue = resValue.filter((item, i) => {
                        if (item.PCI_E_size == 1) {
                            // 如果数量够了，就不再显示
                            return false;
                        }
                        return true;

                    });
                }
            }
            if(this.cpu==2&&this.x8_4==1){
                if (this.x8_3 -blNum[2]-blNum[1]>= 7) {
                    resValue = resValue.filter((item, i) => {
                        if (item.PCI_E_size == 1) {
                            // 如果数量够了，就不再显示
                            return false;
                        }
                        return true;

                    });
                }
            }
            if(this.cpu==2&&this.x8_4==2){
                if (this.x8_3-blNum[2]-blNum[1] >= 6) {
                    resValue = resValue.filter((item, i) => {
                        if (item.PCI_E_size ==1 ) {
                            // 如果数量够了，就不再显示
                            return false;
                        }
                        return true;

                    });
                }
            }
        }else{
            if(this.cpu==1){
                if (this.x8_3 -blNum[2]-blNum[1]>= 7) {
                    resValue = resValue.filter((item, i) => {
                        if (item.PCI_E_size == 1) {
                            // 如果数量够了，就不再显示
                            return false;
                        }
                        return true;

                    });
                }
            }else{
                if (this.x8_3-blNum[2]-blNum[1]>= 8) {
                    resValue = resValue.filter((item, i) => {
                        if (item.PCI_E_size == 1) {
                            // 如果数量够了，就不再显示
                            return false;
                        }
                        return true;

                    });
                }
            }

        }
        this.arr[ind].options = [ ...resValue ];//过滤后的值
        console.log(this.arr, resValue, this.brr, index, ind, this.arr[ind].options);
        this.$forceUpdate();
      }
    },
    recor(index, ind, num) {//添加或者修改数据
      console.log(index, ind, num);
      if(this.arr[ind].options.length<1){
          // this.error='您选的参数不存在，请重新选择'
          // this.open()
          return
      }
      if (index == 0) {
        index = this.arr[ind].options[0].id;
      }
      if (this.arr[ind].upid) {//如果upid存在说明库里有数据，所以修改
        console.log(index, ind, num);
        const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${index}' where id=${this.arr[ind].upid} `;
        this.$db.run(updateSql, (err, res) => {
          console.log(res, err);
          if (res) {
            console.log('修改失败');
          } else {
            console.log('修改成功');
            this.arr[ind].interiorDow = num;
            this.brr[ind] = index;
            this.arr[ind].options.forEach(item=>{
                console.log(item)
                if(item.id==index){
                    this.arr[ind].PCI_E_generation=item.PCI_E_generation
                    this.arr[ind].PCI_E_size=item.PCI_E_size
                }
            })
          }
          const PCI_Catagory_id = `
      select info.name,detail.component_count,detail.categroy_id,io.PCI_E_generation,io.PCI_E_size from component_base_info info
                            join component_iocard io on info.id = io.base_info_id
                             join product_programme_detail detail on io.id=detail.component_id and  detail.                                 categroy_id=${this.sign}

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select io.base_info_id from component_iocard io
                            where io.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            and template_id='${localStorage.templateId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'

       union


      select info.name,detail.component_count,detail.categroy_id,info.description,mem.category_id from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.                                 categroy_id=2

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`;
          this.$db.all(PCI_Catagory_id, (err, res) => {
            console.log(res, err);
            const pci = [];// 获取库里pci的值
            const mem = [];// 获取库里内存的值
            let memNum = 0;// 默认库内存的值为0 ，
            let x8_3 = 0; // 默认x8_3的值我0
            let x8_4 = 0; // 默认x8_3的值我0
            let x16_4 = 0; // 默认x8_3的值我0
            res.forEach(item => {
              if (item.categroy_id == 6) {
                return pci.push(item);
              }
              if (item.categroy_id == 2) {
                return mem.push(item);
              }
            });
            mem.forEach(item => {
              memNum += item.component_count;
            });
            pci.forEach(item => {
              if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                return x8_4 += item.component_count;
              }
              if (item.PCI_E_size == 1 && item.PCI_E_generation != 4) {
                return x8_3 += item.component_count;
              }
              if (item.PCI_E_size == 2) {
                return x16_4 += item.component_count;
              }
            });
          });
        });
      } else {//要不然的话添加
        console.log('没记录：：：');
        const time = new Date().getTime();
        const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.sign}','${index}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
        this.$db.run(updateSql, (err, res) => {
          if (err) {
            console.log('添加失败');
          } else {
            console.log('添加成功' + JSON.stringify(res));
            const selectSql = `select * from product_programme_detail where seq_Key=${time} and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`;
            this.$db.get(selectSql, (err, res) => {
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '系统错误',
                  desc: err,
                });
                return;
              }else{
                  this.arr[ind].upid = res.id;
                  this.arr[ind].interiorDow = res.component_count;
                  this.arr[ind].options.forEach(item => {
                      if (item.id == this.arr[ind].value) {
                          console.log(111111,2, item.PCI_E_size)
                          this.arr[ind].PCI_E_size = item.PCI_E_size;
                          this.arr[ind].PCI_E_generation = item.PCI_E_generation;
                          this.arr[ind].splice(9, 0);
                      }
                  });
                  console.log(this.brr, this.arr[ind]);
              }
            });
          }
          // this.brr[ind]=index;
          this.$set(this.brr, ind, index);
        });
      }
      this.getNum();
      console.log(this.arr);
    },
    getList(event, index) {//点击的时候可选的数量
      console.log(this.cpu, this.x8_4,this.arr,index);
      if (event) {
        for(let i=0;i<this.arr.length;i++){
            console.log(i,this.arr.length)
          if (this.arr[i].PCI_E_size == 2) {
            // 获取的X16 GEN4数量
             this.arr[i].num = (this.cpu == 1 ? 1 : 3) - this.x16_4;
          }
          if (this.arr[i].PCI_E_size == 1 && this.arr[i].PCI_E_generation == 4) {
            // 获取的X8 GEN4数量
               this.arr[i].num = (this.cpu == 1 ? 1 : 2) - this.x8_4;
          }
          if (this.arr[i].PCI_E_size == 1 && this.arr[i].PCI_E_generation != 4) {
            // 获取的X8 GEN3数量
              if(this.cpu==2){
                  if(this.x8_4==0){
                      this.arr[i].num = 8 - this.x8_3;
                  }else if(this.x8_4==1){
                      this.arr[i].num = 7 - this.x8_3;
                  }else if(this.x8_4==2){
                      this.arr[i].num = 6 - this.x8_3;
                  }
              }else{
                  if(this.x8_4){
                      this.arr[i].num = 6 - this.x8_3;
                  }else{
                      this.arr[i].num = 7 - this.x8_3;
                  }
              }
          }
        };
        if (this.arr[index].PCI_E_size == 2) {
          this.arr[index].num += this.arr[index].interiorDow;
        }
        if (this.arr[index].PCI_E_size == 1 && this.arr[index].PCI_E_generation == 4) {
          this.arr[index].num += this.arr[index].interiorDow;
        }
        if (this.arr[index].PCI_E_size == 1 && this.arr[index].PCI_E_generation != 4) {
          this.arr[index].num += this.arr[index].interiorDow;
        }
        this.$forceUpdate();
      }

    },
    getNum(ind,add) {//获取 this.x16_4、this.x8_4、this.x8_3 的值
      this.x16_4 = 0; // 默认的值cpu为一时
      this.x8_4 = 0;// 默认的值cpu为一时
      this.x8_3 = 0;// 默认的值cpu为一时
      // }
      const SQL = `select PCI_E_generation,PCI_E_size ,component_count from
component_iocard pp cross join product_programme_detail ppd on pp.id=ppd.component_id and ppd.categroy_id=${this.sign} where ppd.component_id in(
                select ppd.component_id from product_programme_detail ppd where ppd.product_id='${localStorage.productId}' and ppd.categroy_id=${this.sign} )
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'and machine_id='${localStorage.machineId}'`;
      this.all(SQL, (res, err) => {
        console.log(res);
          this.x16_4 = 0; // 默认的值cpu为一时
          this.x8_4 = 0;// 默认的值cpu为一时
          this.x8_3 = 0;// 默认的值cpu为一时
        for (let i = 0; i < res.length; i++) {
          if (res[i].PCI_E_size == 2) {
            // 获取的X16 GEN4数量
            this.x16_4 += (1 * res[i].component_count);
          }
          if (res[i].PCI_E_size == 1 && res[i].PCI_E_generation == 4) {
            // 获取的X8 GEN4数量
            this.x8_4 += (1 * res[i].component_count);
          }
          if (res[i].PCI_E_size == 1 && res[i].PCI_E_generation != 4) {
            // 获取的X8 GEN3数量
            this.x8_3 += (1 * res[i].component_count);
          }
        }
        if(ind==1){
            add=1
        }
      });
    },
    deletePci(id, ind, value) {//删除数据
      // this.deletePci(id,ind,1)
      if (!id) {
        id = (this.arr[ind].upid ? this.arr[ind].upid : '');
      }
      if (id) {
        const deleteSQL = `DELETE FROM product_programme_detail WHERE id = ${this.arr[ind].upid}`;
        this.$logger(deleteSQL);
        this.$db.run(deleteSQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$db.run('ROLLBACK');
            this.$Notice.error({
              title: '删除失败',
              desc: err,
            });
          }
        });
      }
      for (let i = 0; i < this.arr[ind].options.length; i++) {
        if (this.arr[ind].options[i].id == id) {
          if (this.arr[ind].options[i].PCI_E_generation == 3 && this.arr[ind].options[i].PCI_E_size == 1) {
            this.x8_3 -= this.arr[ind].interiorDow;
          }
          if (this.arr[ind].options[i].PCI_E_generation == 4 && this.arr[ind].options[i].PCI_E_size == 1) {
            this.x8_4 -= this.arr[ind].interiorDow;
          }
        }
      }
      // this.arr[index].optionsVal
      this.brr = this.brr.filter(item => {
        if (item == id) {
          return false;
        }
        return true;
      });
      if (value) {
        this.arr[ind].splice(9, 1);
      } else {
        this.arr.splice(ind, 1);
      }

      this.getNum();
    },
    addCard() {
      if (this.arr[this.arr.length - 1].value == 0) {
        return;
      }
      if ((this.x8_4 + this.x8_3+this.x16_4) >= (this.cpu == 1 ? 8 : 11) || this.arr.length >= (this.cpu == 1 ? 8 : 11)) {
        return;
      }
      let add=0
      this.getNum(1,add);
      this.arr.push([ ...this.interiorTop ]);
      const value = this.arr.length - 1;
      this.arr[this.arr.length - 1].options = [ ...this.pcieS ];
      this.arr[this.arr.length - 1].optionsAl = [ ...this.pcieS ];
      this.arr[this.arr.length - 1].value = '';
      this.arr[this.arr.length - 1].interiorVal = 0;
      this.arr[this.arr.length - 1].PCI_E_size = -1;
      this.arr[this.arr.length - 1].PCI_E_generation = -1;
        this.arr[this.arr.length - 1].num = 0;
        this.$forceUpdate()
      console.log(this.arr,add);
    },
    getsql(index, fun) {
      const SQL = index;
      this.$db.get(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          fun(res);
        }
      });
    },
      open() {
          this.$alert(this.error, {
              confirmButtonText: '确定',
              callback: action => {
                  this.$message({
                      type: 'info',
                      message: `action: ${action}`,
                  });
              },
          });
      },
  },
  beforeRouteEnter(from,to , next) {
    next(vm => {//进入页面执行，
        vm.$emit('comup',from.query.id)
        vm.sign=from.query.sign//记录要查询数据的id
        console.log(vm.sign)
      vm.cpu = vm.$store.state.cpu_C;//获取cpu的值
      if (vm.cpu == 1) {
        vm.cpuNum = 8;
      } else if (vm.cpu == 2) {
        vm.cpuNum = 11;
      }
    });
  },
beforeRouteLeave(to,from,next){
    next()
},
  created() {
    const than = this;
    const cpieK = ' select id,pcie_type from component_pcie_classification';// 获取pcie的配置
    const defaltuPci = `select pp.PCI_E_generation,PCI_E_size,PCI_Catagory_id,info.description PCI_E_desc_cn,ppd.component_count,ppd.id,ppd.seq_Key,ppd.component_id from component_iocard pp
                                    cross join product_programme_detail ppd on pp.id=ppd.component_id and ppd.categroy_id=pp.category_id
                                    left join component_base_info info  on info.id=pp.base_info_id
                where ppd.product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}'`;// 获取库里面的值  ，传进去的
    const pcie_type = 'SELECT id,pcie_type FROM component_pcie_classification ';// 获取类型
    const getCpu = `select component_count from product_programme_detail detail
									join component_cpu cpu on cpu.category_id=detail.categroy_id  and cpu.id=detail.component_id
									where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`;
    function run_CPU() {
      return new Promise(function(resolve, reject) {
        than.getsql(getCpu, resL => { // 获取cpu的值
          if (resL) {
            than.cpu = resL.component_count;
            if (than.cpu == 1) {
              than.cpuNum = 8;
            } else if (than.cpu == 2) {
              than.cpuNum = 11;
            }
            than.$store.commit('setCPU',than.cpu)
            console.log(than.cpu, resL.component_count,than.$store.state.cpu_C,than.cpuNum);
              return resolve();
          }else{
              return resolve();
          }
        });

      });
    }
    function run_a() {//获取库里的数据，传给下一个
      return new Promise(function(resolve, reject) {
        // 假设已经进行了异步操作，并且获得了数据
        // let cpie = ` select PCI_E_generation,PCI_E_size from component_iocard`
        // 获取类型里面的值
        const arr = [];
        const res = [];
        than.all(defaltuPci, res => {
           console.log(res,than.sign,defaltuPci)
          res = [ ...res ];
          return resolve([ res, arr ]);
        });
      });
    }
    function creatA([ res, arr ]) {// 获取库里面的类型
      return new Promise(function(resolve, reject) {
        res.forEach((item, index) => {
          arr.push([]);
          than.all(pcie_type, resA => {
            than.interiorTop = [ ...resA ];
            resA.forEach((it, ind) => {
              arr[index].push(it);
            });
            return resolve([ arr, res ]);
          });
        });
      });
    }
    function creatB([ arr, res ]) {//获取c库里pcie的数据
      let num = 0;
      return new Promise(function(resolve, reject) {
        res.forEach((item, index) => {
          const PCI_Catagory_id = `SELECT io.*,info.description PCI_E_desc_cn FROM COMPONENT_IOCARD io
          left join component_base_info info on info.id=io.base_info_id
          WHERE PCI_Catagory_id =${item.PCI_Catagory_id}`;
          than.all(PCI_Catagory_id, resA => { // 获取库里面的类型
              console.log(item,resA)
            arr[index].options = [ ...resA ];
            arr[index].options.upid = item.id;// 库里面选中的id
            arr[index].PCI_E_generation = item.PCI_E_generation, // 库里面所选中的代数
            arr[index].PCI_E_size = item.PCI_E_size, // 库里面的类型 比如x8_3
            arr[index].interiorDow = item.component_count, // 库里面的个数
            arr[index].value = item.PCI_E_desc_cn, // 库里面选中的id
            //arr[index].PCI_E_desc_cn =  item.PCI_E_desc_cn,//库里面的中文名
           // arr[index].PCI_E_desc_cn= item.PCI_E_desc_cnid
            arr[index].interiorVal = item.PCI_Catagory_id - 1, // 库里面所选中的类型下标
            arr[index].seq_Key = item.seq_key;// 这个是时间戳，
            arr[index].upid = item.id;// 库里面选中的id
            arr[index].num = 0,
            num++;
            if (num == res.length) {
              return resolve(arr);
            }
          });
        });
      });
    }
    function run_b(arr) {//brr里面的值 和x8_3、x8_4、x16_4的值、还有展示的选择了多少
      return new Promise(function(resolve, reject) {
        const brr = [];
        for (let i = 0; i < arr.length; i++) {
          arr[i].optionsAl = [ ...arr[i].options ];
          for (let j = 0; j < arr[i].options.length; j++) {
            if (arr[i].options[j].PCI_E_desc_cn == arr[i].value) {
              arr[i].value = arr[i].options[j].id;
              brr.push(arr[i].options[j].id);
            }
          }
            console.log( arr[i])
          if (arr[i].PCI_E_size == 2) {
            // 获取的X16 GEN4数量
            than.x16_4 += (1 * arr[i].interiorDow);
          }
          if (arr[i].PCI_E_size == 1 && arr[i].PCI_E_generation == 4) {
            // 获取的X8 GEN4数量
            than.x8_4 += (1 * arr[i].interiorDow);
          }
          if (arr[i].PCI_E_size == 1 && arr[i].PCI_E_generation != 4) {
            // 获取的X8 GEN3数量
            than.x8_3 += (1 * arr[i].interiorDow);
          }
          arr[i].options.filter((item, index) => {
            for (let j = 0; j < brr.length; j++) {
              if (item.id === brr[j]) {
                return false;
              }
              return true;
            }
          });
        }
          const PCI_Catagory_id = `
      select info.name,detail.component_count,detail.categroy_id,io.PCI_E_generation,io.PCI_E_size from component_base_info info
                            join component_iocard io on info.id = io.base_info_id
                             join product_programme_detail detail on io.id=detail.component_id and  detail.                                 categroy_id=${than.$route.query.sign}

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select io.base_info_id from component_iocard io
                            where io.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            and template_id='${localStorage.templateId}'  and solution_id='${localStorage.solutionId}'
                            and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'
       union


      select info.name,detail.component_count,detail.categroy_id,info.description,mem.category_id from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.                                 categroy_id=mem.category_id

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id=1
                            and template_id='${localStorage.templateId}'  and solution_id='${localStorage.solutionId}'
                            and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`;
            than.$db.all(PCI_Catagory_id, (err, res) => {
                console.log(res, err);
                let pci = [];// 获取库里pci的值
                let mem = [];// 获取库里内存的值
                let memNum = 0;// 默认库内存的值为0 ，
                let x8_3 = 0; // 默认x8_3的值我0
                let x8_4 = 0; // 默认x8_3的值我0
                let x16_4 = 0; // 默认x8_3的值我0
                res.forEach(item => {
                    if (item.categroy_id == 6) {
                        return pci.push(item);
                    }
                    if (item.categroy_id == 2) {
                        return mem.push(item);
                    }
                });
                mem.forEach(item => {
                    memNum += item.component_count;
                });
                pci.forEach(item => {
                    if (item.PCI_E_size == 1 && item.PCI_E_generation != 4) {
                        return x8_3 += item.component_count;
                    }
                    if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                        return x8_4 += item.component_count;
                    }
                    if (item.PCI_E_size == 2) {
                        return x16_4 += item.component_count;
                    }
                });
                if(than.cpu==1) {
                    if (memNum > 16) {
                        than.error = '内存里的选项有误';
                        than.$emit('erro', 1);
                        than.open();
                    }
                    if (x8_4 == 0) { //判断x8_4是不是为0  因为要向下兼容
                        if (x8_3 > 7) { //如果等于0的话就是x8_3为7个
                            than.error = 'pcie内的x8_3内型选择过多';
                            than.$emit('erro', 3);
                            than.open();
                        }
                    } else {
                        if (x8_3 > 6) {//如果不等于0的话就是x8_3为6个
                            than.error = 'pcie内的x8_3内型选择过多';
                            than.$emit('erro', 3);
                            than.open();
                        }
                    }

                    if (x8_4 > 1) {//如果x8_4大于1的话说明x8_4选多了
                        than.error = 'pcie内的x8_4内型选择过多';
                        than.$emit('erro', 3);
                        than.open();
                    }
                    if (x16_4 > 1) {
                        than.error = 'pcie内的x16_4内型选择过多';
                        than.$emit('erro', 3);
                        than.open();
                    }
                }
                console.log(pci, mem, memNum, x8_3, x8_4, x16_4);
                than.arr = arr;
                than.brr = brr;
                console.log(arr, brr, than.arr);
                return resolve(arr);
            });
      });
    }
    function run_c(data) {;//库里没有数据时执行的,基本不会执行，因为进入页面时会添加数据
      console.log(data);
      return new Promise(function(resolve, reject) {
        // 假设已经进行了异步操作，并且获得了数据
        const cpie = ` select info.description PCI_E_desc_cn,PCI_E_generation,PCI_E_size,io.id from component_iocard io
            left join component_base_info info on info.id=io.base_info_id where PCI_Catagory_id=1`;
        // let cpie =` select PCI_E_desc_cn,PCI_E_generation,PCI_E_size from component_iocard where PCI_Catagory=0`;
        than.all(cpie, res => {
          than.pcieS = [ ...res ];// 获取到添加类型的值，直接点击数量时不会报错
        });
        if (!data) {
          than.all(cpieK, res => {
            res.forEach((item, index) => {
              return item.pcie_type;// 给获取出来的类型添加上卡字
            });// 动态获取配置的选项
            than.interiorTop = [ ...res ];
            than.arr.push([ ...than.interiorTop ]);
            than.arr[0].interiorVal = 0;// 点击后卡的值
            than.arr[0].num = 6;
            // this.interiorTop.pcieS=3 // 点击前能选几位
            than.arr[0].interiorDow = 1; // 点击后的数量
            than.arr[0].optionsVal = ''; // 点击卡类型之后默认展示的内容
            console.log(than.arr, than.interiorTop);
          const cpie = ' select info.description PCI_E_desc_cn,PCI_E_generation,PCI_E_size,io.id from component_iocard io ' +
              'left join component_base_info info on info.id=io.base_info_id ' +
              'where PCI_Catagory_id=1 and PCI_E_generation in (3,4)';
          // let cpie =` select PCI_E_desc_cn,PCI_E_generation,PCI_E_size from component_iocard where PCI_Catagory=0`;
          //than.all(cpie, res => { // 选卡时的事件
            // 动态获取配置的选项
            than.all(cpie, res => {
                console.log(res)
              than.pcieS = [ ...res ];// 获取到添加类型的值，直接点击数量时不会报错
              than.pcieS = than.pcieS.filter((item, index) => {
                if (item.PCI_E_size == 2 && item.PCI_E_generation == 4) {
                  return item = true;
                }
                if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                  return item = true;
                }
                if (item.PCI_E_size == 1 && item.PCI_E_generation == 3) {
                  return item = true;
                }
              });
            //});
                console.log(than.pcieS)
            than.arr[0].options = [ ...than.pcieS ];
            than.arr[0].optionsAl = [ ...than.pcieS ];
            than.arr[0].value = than.arr[0].options[0].id; // 点击后卡的类型的值
            than.arr[0].splice(9, 0);
            than.arr[0].optionsVal = res == 0 ? '没有可以匹配的' : res[0].PCI_E_desc_cn;// 默认展示第一个值,如果没有值显示没有匹配的
                than.recor(than.arr[0].value,0,1)
          });
        })
      };
    });
    }
    run_CPU().then(function() {//获取cpu
      return run_a();//获取c库里pcie的数据
    }).then(function(arr) {
      if (arr[0].length > 0) {
        return creatA(arr);// 获取库里面的类型
      }
      return run_c(false);//库里没有数据时执行的
    })
      .then(function(arr) {
        return creatB(arr);//获取c库里pcie的数据
      })
      .then(function(data) {
        return run_b(data);//brr里面的值 和x8_3、x8_4、x16_4的值、还有展示的选择了多少
      })
      .then(function(data) {
        return run_c(data);//库里没有数据时执行的
      });

  },
};
</script>

<style scoped lang="less">
    .interior-pcle {
        padding: 20px;

        .interior-hea {
            background: rgba(242, 242, 242, 1);
            padding: 5px;
            margin: 10px 0;
        }

        .interior-pei {
            margin-bottom: 20px;

            i {
                margin: 0 20px;
                font-size: 30px;
                height: 24px;
                display: inline-block;
                overflow: hidden;
            }

            .interior-butt {
                margin-left: 30px;
            }
        }

        .interior-pic {
            margin-bottom: 20px;
        }

        .interior-bott {
            p {
                margin: 10px 0;
            }
        }
    }
</style>
