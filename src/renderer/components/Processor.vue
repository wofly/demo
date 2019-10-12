<template>
    <!--cpu处理器-->
    <div class="processor">
        <div class="processor-hea content-label"> {{$t('Processor.lists.computationalNode.title')}}</div>
        <div class="for-main">
          {{$t('Processor.lists.computationalNode.content1')}}：
            <el-select v-model="value" placeholder="1" size="mini"  disabled class="sel" >
                <el-option
                        v-for="item in tempon"
                        :key="item"
                        :label="item"
                        :value="item"
                >
                </el-option>
            </el-select>
        </div>
        <div class="processor-hea content-label">{{$t('Processor.lists.CPUconfiguration.title')}}</div>
        <div class="processor-conte for-main">
            <el-select v-model="valueDown"  size="mini" @change="update(1)">
                <el-option
                        v-for="(item,index) in options"
                        :key="item"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
            <p>*</p>
            <el-select v-model="valueNum" placeholder="1" size="mini" @change="update(valueNum)" class="sel" >
                <el-option
                        v-for="item in optionsNum"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <div class="pdiv">
                {{temponTit}}
            </div>
            <div class="pdiv">
              {{$t('Processor.lists.CPUconfiguration.content1')}} {{valueNum}} / {{optionsNum}}
            </div>
        </div>

        <div class="processor-hea content-label">{{ $t('Processor.lists.ActiveConfiguration.title')}}</div>
        <div class="block">
            <el-slider v-model="value1"
                       :max="10*valueNum"
                       :show-tooltip="false"
                       disabled
                       @change="updateCore(value1?value1:10)"></el-slider>
          {{$t('Processor.lists.ActiveConfiguration.content1')}}： {{value1?value1:10}}/ {{10*valueNum}}
        </div>
        <div class="processor-hea content-label">{{ $t('Processor.lists.promptMessage.title')}}</div>
        <div class="processor-butt">
            <p>
              {{$t('Processor.lists.promptMessage.content1')}}<br/>
              {{$t('Processor.lists.promptMessage.content2')}}
            </p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Processor',
  data() {
    return {
      value1: 10, // 滑块的值
      value: '', // 点击之后的结算节点的数量
      valueNum: 1, // 点击之后的插槽数量，默认为1
      valueDown: 0, // 点击之后的cpu的配置
      options: [], // cpu的配置，动态获取的
      optionsNum: 2, // 动态获取插槽的数量，现在写的死数据
      tempon: '', // 计算节点的数量，动态获取的
      temponTit: '', // cpu的提示信息，动态获取的
      name_id: '', // 产品的id
      cpu: 3, // 父组件传进的cpu
      vaule_id: '',
      sign:3,
      error: '不可选',
      component_id:0,//cpu的激活码id
    };
  },
  methods: {
    getsql(index, fun) {//获取单个数据的简单封装
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
    update(num) { // 设置cpu的数量
      const selectSql = `select * from product_programme_detail where product_id=${localStorage.productId} AND categroy_id=${this.sign} AND template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'and machine_id='${localStorage.machineId}'`;
      this.$db.get(selectSql, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '系统错误',
            desc: err,
          });
          return;
        }
        console.log(res);
        if (res) {
            const id = res.id;
             const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${id} and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'`;
           if (num == 2) {
             this.value1 = 20;
             this.updateCore(20);
               this.$db.run(updateSql, (err, res) => {
                   if (res) {
                       console.log('修改失败');
                   } else {
                       console.log('修改成功');
                       this.$store.commit('setCPU', num);
                   }
               });
           }
            if (num == 1) {
                const PCI_Catagory_id = `
      select info.name,detail.component_count,detail.categroy_id,io.PCI_E_generation,io.PCI_E_size from component_base_info info
                            join component_iocard io on info.id = io.base_info_id
                             join product_programme_detail detail on io.id=detail.component_id and  detail.                                 categroy_id=6

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select io.base_info_id from component_iocard io
                            where io.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            AND product_id=${localStorage.productId}
                            AND template_id='${localStorage.templateId}'
                            and machine_id='${localStorage.machineId}'

       union all


      select info.name,detail.component_count,detail.categroy_id,info.description,mem.category_id from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.                                 categroy_id=mem.category_id

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                              AND product_id=${localStorage.productId}
                            AND template_id='${localStorage.templateId}'
                            and machine_id='${localStorage.machineId}'`;
                this.$db.all(PCI_Catagory_id, (err, res) => {
                    let boo=true
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
                        if (item.PCI_E_size == 1 && item.PCI_E_generation == 3) {
                            return x8_3 += item.component_count;
                        }
                        if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                            return x8_4 += item.component_count;
                        }
                        if (item.PCI_E_size == 2 && item.PCI_E_generation == 4) {
                            return x16_4 += item.component_count;
                        }
                    });
                    if (memNum > 16) {
                        this.error = '内存里的选项有误,更改失败';
                        //this.$emit('erro', 1);
                        boo=false
                        this.open();
                    }
                    if (x8_3 > 6) {
                        this.error = 'pcie内的x8_3内型选择过多,更改失败';
                        //this.$emit('erro', 3);
                        boo=false
                        this.open();
                    }
                    if (x8_4 > 1) {
                        this.error = 'pcie内的x8_4内型选择过多,更改失败';
                       // this.$emit('erro', 3);
                        boo=false
                        this.open();
                    }
                    if (x16_4 > 1) {
                        this.error = 'pcie内的x16_4内型选择过多,更改失败';
                        //this.$emit('erro', 3);
                        boo=false
                        this.open();
                    }
                    console.log(pci, mem, memNum, x8_3, x8_4, x16_4);
                    if(boo){
                        this.value1 = 10;
                        this.updateCore(10);
                        this.valueNum = 1;
                        this.$db.run(updateSql, (err, res) => {
                            if (res) {
                                console.log('修改失败');
                            } else {
                                console.log('修改成功');
                                this.$store.commit('setCPU', num);
                            }
                        });
                    }else{
                        this.value1 = 20;
                        this.valueNum = 2;
                    }
                });
            }
        } else {
          console.log('没记录：：：' + res);
          const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','categroy_id','component_id','component_count','solution_id','template_id') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.sign}','1','${num}','${localStorage.solutionId}','${localStorage.templateId}')`;
          this.$db.run(updateSql, (err, res) => {
            if (res) {
              console.log('添加失败');
            } else {
              console.log('添加成功');
              this.$store.commit('setCPU', num);
                this.updateCore(this.value1?this.value1:10);
            }
          });
        }
      });
    },
    open() {//不能更改是的弹框
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
    updateCore(num) { // 设置激活的数量
      const selectSql = `select * from product_programme_detail where solution_id='${localStorage.solutionId}' AND categroy_id=${this.$route.query.signT} and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and product_id='${localStorage.productId}'`;
      this.$db.get(selectSql, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '系统错误',
            desc: err,
          });
          return;
        }
        console.log(res);
        if (res) {
          console.log(res.id);
          const id = res.id;
          const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${id} and template_id='${localStorage.templateId}' AND solution_id='${localStorage.solutionId}'`;
          this.$db.run(updateSql, (err, res) => {
            if (res) {
              console.log('修改失败');
            } else {
              console.log('修改成功');
            }
          });
        } else {
          console.log('没记录：：：' + res);
          const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','categroy_id','component_id','component_count','solution_id','template_id') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.signT}','${this.component_id}','${num}','${localStorage.solutionId}','${localStorage.templateId}')`;
          this.$db.run(updateSql, (err, res) => {
            if (err) {
              console.log('添加失败');
            } else {
              console.log('添加成功');
            }
          });
        }
      });
    },
  },
    beforeRouteEnter(from,to,next){//进入页面时执行获取参数
        next(vm=>{
            vm.$emit('comup',from.query.id)
            vm.sign=from.query.sign
            console.log(from,vm.$route,vm.sign)
        })
    },
  created() {
    const cpu = 'select bs.description,title_msg from component_base_info bs left join component_cpu cp on cp.base_info_id=bs.id where bs.id in(select cp.base_info_id from component_cpu) '; // 获取cpu的配置、cpu的提示信息，库里的链接
    const templa = `select computeNode_cnt,product_name,id from product_info where id='${localStorage.productId}' `;// 获取cpu的计算节点数量 库里的链接
    const getcpu = `select component_count from product_programme_detail detail
									join component_cpu cpu on cpu.category_id=detail.categroy_id  and cpu.id=detail.component_id
									where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`;
    const getNum = `select component_count,component_id,id from product_programme_detail where product_id='${localStorage.productId}' and categroy_id=${this.$route.query.signT} and template_id='${localStorage.templateId}'AND solution_id='${localStorage.solutionId}'and machine_id='${localStorage.machineId}'`;
    this.getsql(cpu, res => { // 获取cpu的配置是个对象，后增到数组里面
      console.log(res);
      this.options.push(res.description);
      this.temponTit = res.title_msg; // cpu的提示信息更改为获取的
    });
    this.getsql(templa, res => { // 获取cpu的计算节点数量，改变默认的
      console.log(res);
      if (res) {
        this.tempon = res.computeNode_cnt;
        this.name_id = res.id;
        this.getsql(getcpu, res => { // 获取cpu的计算节点数量，改变默认的
          console.log(res,getcpu);
          if (res) {
            this.valueNum = res.component_count;
            // this.$store.mutations.setCPU(res.component_count)
            this.$store.commit('setCPU', res.component_count);
            console.log(this.$store.state.cpu_C);
            if (res.component_count == 2) {
              this.value1 = 20;
            }
          }

        });
        this.getsql(getNum, res => { // 获取cpu的计算节点数量，改变默认的
          console.log(res);
          if (res) {
            this.value1 = res.component_count;
            this.vaule_id = res.id;
            this.component_id=res.component_id
          }
        });
      }

    });
  },
};
</script>

<style scoped lang="less">
    .processor {
        padding: 20px;

        .processor-hea {
            background: rgba(242, 242, 242, 1);
            padding: 5px;
        }
        .for-main {
            padding: 20px 0;
        }

        .processor-conte {
            margin: 30px 0;

            i {
                margin: 0 20px;
                font-size: 30px;
                height: 20px;
                display: inline-block;
                overflow: hidden;
            }

            .pdiv {
                margin: 10px 0;
            }
        }

        .scroll {
            margin: 50px;
            width: 500px;
            height: 5px;
            background: #ccc;
            position: relative;
            cursor: pointer;
        }
        p {
            /*margin-left: 20px;*/
        }

        .bar {
            width: 10px;
            height: 20px;
            background: #369;
            position: absolute;
            top: -7px;
            left: 0;
            cursor: pointer;
        }

        .mask {
            position: absolute;
            left: 0;
            top: 0;
            background: #369;
            width: 0;
            height: 5px;
        }

        .block{
            width: 38%;
            padding-left: 10px;
            padding-top: 20px;
            margin-bottom: 20px;
        }
        .processor-butt{
            p{
                padding: 20px 0 0 10px;
            }

        }
    }
</style>
