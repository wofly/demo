<template>
  <!--电源页面-->
  <div class="wrap">
    <div class="out-p content-label">
      {{$t('Power.lists.PowerSupply.title')}}
    </div>
    <!--下拉框选项-->
    <div v-for="(ite,index) in Clkadd" :key="index">
      <div class="for-main">
      <el-select size="mini" v-model="ite.value" placeholder="请选择" class="sel-main">
        <el-option
            v-for="(item,ind) in setLists"
            :key="ind"
            :label="$store.state.info_language?item.description_en:item.description"
            :value="ind">
        </el-option>
      </el-select>
      <p>*</p>
      <el-select size="mini" v-model="ite.powermaxTop" placeholder="请选择" class="sel" @change="setNum">
        <el-option
            v-for="item in powermax"
            :key="item"
            :label="item,powermax"
            :value="item.powermaxTop">
        </el-option>
      </el-select>
      </div>
      <div v-for="(dl,ind) in uiStatusEn" :key="dl.id" v-if="ite.value==ind">
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
    </div>

    <div class="addBtn" :title="titshow">
      <el-button class="addtn" size="mini" icon="el-icon-plus" @click="addClk" disabled></el-button>
      <span class="add-cables">{{$t('Power.lists.PowerSupply.content1')}}</span>
    </div>

    <div class="out-p content-label">
      {{$t('Power.lists.PowerLine.title')}}
    </div>

    <div v-for="(ite,index) in Clkadd2">
      <div class="for-main">
      <el-select size="mini" v-model="ite.value2" placeholder="请选择" class="sel-main" @visible-change="getRec($event,ite.value2)">
        <el-option
            v-for="(item,ind) in setNums"
            :key="ind"
            :value="ind"
            :label="$store.state.info_language?item.description_en:item.description"
            :disabled="item.disabled"
        >
        </el-option>
      </el-select>
      <p>*</p>
      <el-select size="mini" v-model="powerLinemaxTop" placeholder="请选择" class="sel">
        <el-option
            v-for="item in powerLinemax"
            :key="item.powerLinemax"
            :value="item"
        >
        </el-option>
      </el-select>
      </div>
      <div v-for="(dl,ind) in uiStatusEnM" :key="dl.id" v-if="ite.value2==ind">
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
    </div>
    <div class="addBtn" :title="titshow">
      <el-button class="addtn" size="mini" icon="el-icon-plus" @click="addClk2" disabled></el-button>
      <span class="add-cables">{{$t('Power.lists.PowerLine.content1')}}</span>
    </div>

    <div class="out-p content-label">
      {{$t('Power.lists.Notice1.title')}}
    </div>
    <ul>
      <li>{{$t('Power.lists.Notice1.content1')}}：<span>{{poweradd}}W</span></li>
      <li>{{$t('Power.lists.Notice1.content2')}}：<span>{{rabbet}}W</span></li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'PowerLine',
  components: {},
  data() {
    return {
      rabbet: 0,
      value: '', // 电源默认显示
      value2: '', // 电源线默认显示
      Clkadd: [], // 总计
      Clkadd2: [], // 总计2
      setLists: [], // 电源
      setNums: [], // 电源线
      powermax: [], // 电源最大
      powermaxTop: null,
      powerLinemax: [], // 电源线最大
      powerLinemaxTop: null,
      powernum: [],
      titshow: '禁用状态',
      powerLineall: 0,
      powerall: 0,
      poweradd: 0,
      powId: [],
      powlineId: [],
      frontHarddiskId: '',
      frontHarddiskId2: '',
      uiStatusEn:[],//展示的电源的下面的内容
      uiStatusEnM:[]//展示的电源线的下面的内容
    };
  },
  methods: {
    // setCapacity() {
    //   for (let i = 0; i < this.Clkadd.length; i++) {
    //     console.log(this.Clkadd[i]);
    //   }
    // },
    getRec(bool,index){
      if(bool){
        let gettime= new Date().getTime() //获取现在的时间戳
        this.setNums.filter((item,ind)=>{
          if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
            return false //如果时间小于现在时间，也就说过市了，不在显示
          }
        })
      }

    },
    setNum() { // 计算总值
      const len = this.Clkadd.length; // 总共几个内存
      let num = 0; // 创建总量
      let num2 = 0;
      for (let i = 0; i < len; i++) {
        num = this.Clkadd[i].powermax;
        num2 = this.Clkadd[i].powernum[0];
        console.log(num, num2);
        this.rabbet = num * num2;
        // console.log(this.rabbet);
      }
    },
    getDataList() {
      // 获取数据
      const SQL = `select power.id,info.description,info.description_en,power,line_maxcount,line_mincount,info.withdraw_date,
       info.title_msg,info.ui_status from component_base_info info
		 join component_power power on power.base_info_id=info.id and power.base_info_id=6`; // 电源
      const SQLNUM = 'SELECT info.description,info.description_en line_des,info.status,info.withdraw_date,info.title_msg,info.ui_status FROM component_powerline line left join relation_power_powerline re on line.id=re.powerline_id left join component_base_info info on info.id=line.base_info_id where line.id in(select powerline_id from relation_power_powerline)'; // 电源线
      // let obj = {};
      this.$db.all(SQL, (err, res) => { // 获取电源
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          res.forEach((item,index)=>{
            this.$set(item,'temponTit',item.title_msg) //展示的描述
            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
            if(item.withdraw_date){
              let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
              let time = new Date(thisTime).getTime();//将时间改为时间戳
              this.$set(res[index],'time',time)//将时间戳添加到对象里面
              //如果不为null的话,就改为天数
              this.$store.commit('setStatusTime',item.withdraw_date)
              this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
            }else{
              this.$set(res[index],'time','不比')//将时间戳添加到对象里面
            }
            this.$store.commit('uiStatusTime',item.ui_status)
            this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
            this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
          });
          console.log(res)
          this.uiStatusEn=res
          for (let i = 0; i < res.length; i++) {
            this.setLists.push({description_en:res[i].description_en,description:res[i].description});
            this.powermax.push(res[i].line_maxcount);
            this.powerLinemax.push(res[i].line_mincount);
            this.powermaxTop = res[i].line_maxcount;
            this.powerLinemaxTop = res[i].line_mincount;
            this.powernum.push(res[i].power); // 获取电耗
            this.powId.push(res[i].id);
            console.log(this.setLists, res); // 获取所有电源
            console.log(res, this.powerLinemaxTop);
          }
          this.rabbet = this.powerLinemaxTop * this.powernum;
        }
      });
      this.$db.all(SQLNUM, (err, res) => { // 获取电源线
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          res.forEach((item,index)=>{
            this.$set(item,'temponTit',item.title_msg) //展示的描述
            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
            if(item.withdraw_date){
              let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
              let time = new Date(thisTime).getTime();//将时间改为时间戳
              this.$set(res[index],'time',time)//将时间戳添加到对象里面
              //如果不为null的话,就改为天数
              this.$store.commit('setStatusTime',item.withdraw_date)
              this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
            }else{
              this.$set(res[index],'time','不比')//将时间戳添加到对象里面
            }
            this.$store.commit('uiStatusTime',item.ui_status)
            this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
            this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
          });
          this.uiStatusEnM=res
          for (let i = 0; i < res.length; i++) {
            const obj = {};
            obj.description_en = res[i].line_des;
            obj.description = res[i].description;
            obj.time = res[i].time;
            if (i > 0) {
              obj.disabled = true;
            } else {
              obj.disabled = false;
            }
            this.setNums.push(obj); // 获取所有电源线
             console.log(this.setNums, res);
          }
        }
      });
    },
    getMax() {
      const MaxSum = ` select info.watt,detail.component_count,info.status
	from product_programme_detail detail
	left join solution           so     on  so.id=detail.solution_id
	left join component_category cate 	on 	cate.id	=detail.category_id
	left join component_memory   mem  	on 	mem.id	=detail.component_id and detail.category_id=2
	left join component_iocard   io   	on	io.id  	=detail.component_id and detail.category_id=6
	left join component_disk     disk 	on	disk.id	=detail.component_id and detail.category_id=1
	left join component_cpu      cpu    on  cpu.id 	=detail.component_id and detail.category_id=3
	left join component_power    power  on  power.id=detail.component_id and detail.category_id=5
	left join component_backplane back  on  back.id =detail.component_id and detail.category_id=7
	left join component_other    other  on  other.id=detail.component_id and detail.category_id=17
	left join component_base_info info  on 	info.id=mem.base_info_id
																			or 	info.id=io.base_info_id
																			or 	info.id=disk.base_info_id
																			or  info.id=cpu.base_info_id
																			or  info.id=power.base_info_id
																			or  info.id=back.base_info_id
																			or  info.id=other.base_info_id
	where detail.category_id in (1,2,3,5,6,7,17)
	                                    and so.id='${localStorage.solutionId}'
                                        and product_id='${localStorage.productId}'
                                        and template_id='${localStorage.templateId}'
                                        and machine_id='${localStorage.machineId}'
                                        and is_expansion=1`;
      const numMax = '';
      this.$db.all(MaxSum, (err, res) => {

        if (err) {
          console.log(MaxSum);
        }

        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          for (let i = 0; i < res.length; i++) {
            this.poweradd += res[i].watt * 1 * res[i].component_count * 1;
          }
        }
      });
    },
    defaultList() { // 默认显示一列
      for (let i = 0; i < 1; i++) {
        this.addClk();
      }
    },
    defaultList2() { // 默认显示一列
      for (let i = 0; i < 1; i++) {
        this.addClk2();
      }
    },
    setState(ind) { // 数据库存储数据
      console.log(ind, this.Clkadd);
      if (this.frontHarddiskId != '') {
        const updateSql = `UPDATE product_programme_detail set 'component_count'='4',component_id='1' where id=${this.frontHarddiskId}`;
        this.$db.run(updateSql, (err, res) => {
          if (err) {
            console.log(updateSql);
          }

          if (res) {
            console.log('修改失败');
          } else {
            console.log('修改成功');
          }
        });
      } else {
        const time = new Date().getTime();
        const SQL = `INSERT INTO product_programme_detail
    ('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion')
    VALUES('${localStorage.productId}','${localStorage.machineId}','5','1','4','${time}','${localStorage.solutionId}','${localStorage.templateId}'
    ,'1')`;
        this.$db.run(SQL, (err, res) => {
          if (err) {
            console.log(SQL);
          }
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
              const selectSql = `select * from product_programme_detail where seq_Key=${time}
                                                                        and solution_id='${localStorage.solutionId}'
                                                                        and product_id='${localStorage.productId}'
                                                                        and template_id='${localStorage.templateId}'
                                                                        and machine_id='${localStorage.machineId}'
                                                                        and is_expansion=1`;

              this.$db.get(selectSql, (err, res) => {
                if (err) {
                  console.log(selectSql);
                }
                if (err) {
                  this.$logger(err);
                  this.$Notice.error({
                    title: '系统错误',
                    desc: err,
                  });
                  return;
                }
                this.frontHarddiskId = res.id;
                console.log(this.frontHarddiskId);
              });
            }
          }
        });
      }
    },

    setState2() { // 数据库存储数据
      if (this.frontHarddiskId2 != '') {
        const updateSql = `UPDATE product_programme_detail set 'component_count'='4',component_id='
                1' where id=1`;
        this.$db.run(updateSql, (err, res) => {
          if (err) {
            console.log(updateSql);
          }
          if (res) {
            console.log('修改失败');
          } else {
            console.log('修改成功');
          }
        });
      } else {
        console.log(1111);
        const time = new Date().getTime();
        const SQL = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','solution_id','seq_Key','template_id','is_expansion')
        VALUES('${localStorage.productId}','${localStorage.machineId}','8','1','4','${localStorage.solutionId}','${time}','${localStorage.templateId}'
        ,1)`;
        this.$db.run(SQL, (err, res) => {
          if (err) {
            console.log(SQL);
          }
          console.log(err, res);
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
              const selectSql = `select * from product_programme_detail where seq_Key=${time}
                                                                        and solution_id='${localStorage.solutionId}'
                                                                        and product_id='${localStorage.productId}'
                                                                        and template_id='${localStorage.templateId}'
                                                                        and machine_id='${localStorage.machineId}'
                                                                        and is_expansion=1`;
              this.$db.get(selectSql, (err, res) => {
                if (err) {
                  console.log(selectSql);
                }
                if (err) {
                  this.$logger(err);
                  this.$Notice.error({
                    title: '系统错误',
                    desc: err,
                  });
                  return;
                }
                this.frontHarddiskId2 = res.id;
                console.log(this.frontHarddiskId2);
              });
            }
          }
        });
      }
    },
    addClk() { //  点击添加电源所在数值
      const obj = {};
      // obj.ids = this.ids;
      obj.setLists = this.setLists;
      obj.powerLinemax = this.powerLinemax;
      this.value = '[EB2M]AC Power Supply - 1400W for Server (200-240 VAC)';
      obj.value = 0;
      obj.powernum = this.powernum;
      obj.id = this.powId;
      obj.powId = this.powId;
      obj.frontHarddiskId = null;
      this.Clkadd.push(obj);
      console.log(this.Clkadd);
    },
    addClk2() { // 点击添加电源线数值
      const obj2 = {};
      // obj.ids = this.ids;
      obj2.setNums = this.setNums;
      obj2.powerLinemax = this.powerLinemax;
      this.value2 = '[6493]Power Cord 2.7m (9-ft), Drawer to Wall/OEM PDU,  (250V/10A)';
      obj2.value2 = 0;
      obj2.powlineId = this.powlineId;
      obj2.powerLinemaxTop = this.powerLinemaxTop;
      obj2.frontHarddiskId = null;
      this.Clkadd2.push(obj2);
      console.log(this.Clkadd2);
    },
  },
  mounted(){
    this.getDataList();
    this.defaultList();
    this.defaultList2();
    this.getMax();
  },
  created() {

    /*获取product_programme_detail  表里的 电源数据  查找id 进行赋值*/
    const SQL = ` select detail.id,detail.category_id from product_programme_detail detail
									 join component_power power on power.category_id=detail.category_id and detail.component_id=power.id
									 where product_id='${localStorage.productId}'
									  and solution_id='${localStorage.solutionId}'
									  and machine_id='${localStorage.machineId}'
									  and template_id='${localStorage.templateId}'
									  and is_expansion=1`
    this.$db.all(SQL, (err, res) => {
      if (err) {

      } else {
        console.log(res)
        if(res.length>0){
          this.frontHarddiskId = res[0].id;
          console.log(this.frontHarddiskId)
        }

      }
    })

    /*获取product_programme_detail  表里的 电源线数据  查找id 进行赋值*/
    const SQLData = ` select detail.id,detail.category_id from product_programme_detail detail
									 join component_category cate on cate.id=detail.category_id and detail.category_id=8
									 join component_powerline line on line.id=detail.component_id
									 where product_id='${localStorage.productId}'
									 and solution_id='${localStorage.solutionId}'
									 and machine_id='${localStorage.machineId}'
									 and template_id='${localStorage.templateId}'
									 and is_expansion=1`
    this.$db.all(SQLData, (err, res) => {
      if (err) {

      } else {
        if(res.length>0){
          this.frontHarddiskId2 = res[0].id;
          console.log(this.frontHarddiskId2)
        }

      }
    })
  },

  beforeRouteEnter(from, to, next) {
    next(vm => {
      vm.$emit('comup', from.query.id);
      vm.getMax();
    });
  },
};
</script>

<style scoped lang="scss">
  * {
    list-style: none;
    box-sizing: border-box;
  }

  .wrap {
    padding: 20px;

    .out-p {
      width: 100%;
      margin-top: 20px;
      margin-bottom: 20px;

      p {
        height: 30px;
        line-height: 30px;
        width: 100%;
        margin-top: 12px;
        background: #f2f2f2;
        padding-bottom: 12px;
      }
    }

    .addBtn {
      padding-top: 14px;
      padding-bottom: 14px;

      .add-btn {
        width: 35px;
        display: inline-block;
        text-align: center;
        border: 2px solid #666666;
        font-size: 22px;
      }

      .add-font {
        margin-left: 12px;
      }
    }
  }

  .for-main {
    margin-top: 14px;
    display: flex;
    height: 36px;
    line-height: 36px;

    .sel-main {
      width: 400px;
    }

    .sel {
      width: 100px;
    }
  }

</style>
