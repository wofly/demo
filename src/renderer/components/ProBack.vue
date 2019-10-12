<template>
  <!--电源选择select-->
  <div class="wrap">
    <div class="listtap">
      <div>机器1 - 配置清单</div>
      <button class="el-button el-button--primary el-button--small" @click="goBack">返回</button>
    </div>
    <!--硬件-->
    <div class="tsLists">
      <el-row :gutter="24">
        <el-col :span="3">
        <div class="grid-content">硬件</div>
      </el-col>
        <el-col :span="5">
          <div class="grid-content">列表总价：￥{{totalPrice}}</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">折扣：
            <el-input v-model="input" @change="discountData(totalPrice,input,input1,2)" ></el-input>
            %off
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">折扣总价：￥
            <el-input v-model="input1" @change="getDiscountPrice(totalPrice,input,input1,2)"></el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--软件-->
    <div class="tsLists">
      <el-row :gutter="24">
        <el-col :span="3">
          <div class="grid-content">软件</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">列表总价：￥{{totalPrice1}}</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">折扣：
            <el-input v-model="input2"  @change="discountData1(totalPrice1,input2,input3,1)" ></el-input>
            %off
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">折扣总价：￥
            <el-input v-model="input3"  @change="getDiscountPrice1(totalPrice1,input2,input3,1)"></el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--机器-->
    <div class="tsLists">
      <el-row :gutter="24">
        <el-col :span="3">
          <div class="grid-content">机器</div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">列表总价：￥{{totalPrice2}}</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">折扣：
            <el-input v-model="input4"  @change="discountData2(input4)" ></el-input>
            %off
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content"> 折扣总价：￥{{input5}}</div>
        </el-col>
      </el-row>
    </div>
    <!--机器总价-->
    <div class="tsLists">
      <el-row :gutter="24">
        <el-col :span="3">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content">机器总价:￥{{totalPrice3}}</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">机器数量：
            <el-input v-model="input6" @change="discountData3(input6)" ></el-input>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content"> 折扣总价：￥{{input7}}</div>
        </el-col>
      </el-row>
    </div>
    <!--table表格-->
    <div class="addline">
      <el-table
          :data="showLists"
          style="width: 100%; background: none;">
        <el-table-column
            prop="nums"
            label="序号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="component_PN"
            label="PN"
            width="180">
        </el-table-column>
        <el-table-column
            prop="component_FC"
            label="FC">
        </el-table-column>
        <el-table-column
            prop="name"
            label="分类">
        </el-table-column>
        <el-table-column
            prop="description"
            label="配件描述">
        </el-table-column>
        <el-table-column
            prop="component_count"
            label="数量">
        </el-table-column>
        <el-table-column
            prop="listprice_onshore"
            label="列表价">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PLlist',
  data() {
    return {
     // 硬件
      input: 10,
      input1: 0,
      totalPrice: '',


      // 软件
      input2: 10,
      input3: 0,
      totalPrice1: '',

      // 机器
      input4: 10,
      input5: '',
      totalPrice2: '',


      // 机器总价
      input6: 1,
      input7: '',
      totalPrice3: '',


      // 选择列表
      options: [],
      showLists: [],

      // HDWnum: 0, // 硬件总数
      // HDWdis: 10, // 硬件折扣
      // HDWnumDis: 0, // 硬件打折总量
      //
      // SFWnum: 0, // 硬件总数
      // SFWdis: 10.00, // 硬件折扣
      // SFWnumDis: 0, // 硬件打折总量
      //
      // MACnum: 0, // 硬件总数
      // MACdis: 10.00, // 硬件折扣
      // MACnumDis: 0, // 硬件打折总量

      MACadd: 0,
      MACaddDis: 0,
      allNums: 0,
      allNum: 0,
      discount: 0.1,
      machine: 1,
      endNum: 0
    };
  },
  methods: {

    /*硬件*/
    getDiscountPrice(total,discount,totalDiscount,num) {
      this.input = 100 - totalDiscount / this.totalPrice * 100;
      this.mediumHardDiskData(total,discount,totalDiscount,num);
    },
    /*硬件*/
    discountData(total,discount,totalDiscount,num) {
      if (discount < 100 && discount > 9) {
        this.input1 = this.totalPrice * (100 - discount) / 100;
        this.mediumHardDiskData(total,discount,totalDiscount,num);
      } else {
        this.$message({
          message: '请输入正确折扣价',
          type: 'warning',
        });
      }
    },


    /*软件*/
    getDiscountPrice1(total,discount,totalDiscount,num) {
      this.input2 = 100 - totalDiscount / this.totalPrice1 * 100;
      this.mediumHardDiskData(total,discount,totalDiscount,num);
    },
    /*软件*/
    discountData1(total,discount,totalDiscount,num) {
      if (discount < 100 && discount > 9) {
        this.input3 = this.totalPrice1 * (100 - discount) / 100;
        this.mediumHardDiskData(total,discount,totalDiscount,num);
      } else {
        this.$message({
        message: '请输入正确折扣价',
        type: 'warning',
      });
    }
    },

    mediumHardDiskData(total,discount,totalDiscount,num) {
      let dis = parseInt(discount) ;
      let tot =0
      if(num ==1){
        tot = parseInt(this.input3) ;
      }else{
       tot = parseInt(this.input1) ;
      }
      console.log(total,dis,tot,num)

      const updateSql = `UPDATE machine_price_detail set 'product_id'='${localStorage.productId}',solution_id='${localStorage.solutionId}',
      list_price='${total}',discount='${discount}',discount_price='${tot}' where machine_id = '${localStorage.machineId}' and configure_type='${num}'`
      console.log(updateSql)
      this.$db.run(updateSql, (err, res) => {
        if (res) {
          console.log("修改失败")
        } else {
          console.log("修改成功")
        }
      })
    },

    /*机器*/
    getDiscountPrice2(num) {
      this.input4 = 100 - num / this.totalPrice2 * 100;
    },
    /*机器*/
    discountData2(num) {
      if (num < 100 && num > 9) {
        this.input5 = this.totalPrice2 * (100 - num) / 100;
      } else {
        this.$message({
          message: '请输入正确折扣价',
          type: 'warning',
        });
      }
    },


    /*机器总价格*/
    discountData3(num) {
      this.totalPrice3 = this.totalPrice2 * num;
      this.input7 = this.input5 * num;
      this.addDiscountData(num);
    },

    /*往数据库里插入已选数据*/
    addDiscountData(num) {
      /*机器总价*/
      let discount = parseInt(this.totalPrice3);
      /*折扣价*/
      let discountPrice =parseInt(this.input7);
      console.log(discount,discountPrice)
      
      const updateSql = `update machine_info set count='${num}',list_price='${discount}' where id='${localStorage.machineId}'`
      // console.log(updateSql)
      this.$db.run(updateSql, (err, res) => {
        if (res) {
          console.log("修改失败")
        } else {
          console.log("修改成功")
        }
      })
    },

    // 数据获取
    getDataListnum() {
      // 获取数据
      const SQL = `			select product.product_name,pp.remark_name,pp.count,pp.list_price
      from machine_info pp  join product_info product on product.id=pp.product_id where product.id=1
                              `;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          for (let i = 0; i < res.length; i++) {
            console.log(res);
            this.machine = res[i].count;
            this.allNum = res[i].sale_untax;
            this.endNum = res[i].sale_tax;
          }
        }
      });

      const SQLData = `SELECT list_price,configure_type FROM "machine_price_detail" where
      product_id='${localStorage.productId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`;
      console.log(SQLData)
      this.$db.all(SQLData, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          console.log('是否有值::::::'+res);
          res.forEach((item)=>{
            if(item.configure_type == 1){
              this.totalPrice1 = item.list_price;
            }
            if(item.configure_type == 2){
              this.totalPrice = item.list_price;
            }
            console.log(item)
          })
          this.totalPrice2 = this.totalPrice1 + this.totalPrice;

          this.input1 = this.totalPrice * ((100 - this.input) / 100);
          this.input3 = this.totalPrice1 * ((100 - this.input2) / 100);
          this.input5 = this.input1 + this.input3
        }
      });
      this.setnum();
    },
    goBack() {
      this.$router.push({ // 核心语句
        path: '/Projectpar', // 跳转的路径
        query: { // 路由传参时push和query搭配使用 ，作用时传递参数
          // id: 0,
        },
      });
    },
    setnum() { // 计算折扣方法
      if (this.machine <= 1) {
        this.machine = 1;
        console.log('>>>>>>>>>>', this.discount);
        this.allNum = (this.allNums * this.machine).toFixed(2); // 计算无折扣
        this.endNum = (this.discount / 100 * this.allNums * this.machine).toFixed(2); // 计算折扣
      } else {
        this.allNum = (this.allNums * this.machine).toFixed(2);
        this.endNum = (this.discount / 100 * this.allNums * this.machine).toFixed(2);
      }
      this.setSQL();
      this.$store.commit('changeMachine', this.machine);
    },
    setSQL() { // 利用
      const SQL = `update machine_info  set count='${this.machine}',list_price='${this.allNum}'`;
      console.log(this.machine, this.allNum);
      this.$db.run(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          // console.log(this.showdata, allNum);
        }
      });
    },
    getDataList() {
      // 获取列表全数据
      const SQL = `select info.component_PN,info.component_FC,detail.categroy_id,info.name,info.description,detail.component_count,info.listprice_onshore
from product_programme_detail detail
left join solution           so     on  so.id=detail.solution_id
 left join component_categroy cate  on  cate.id =detail.categroy_id
left join component_memory   mem   on  mem.id =detail.component_id and detail.categroy_id=2
left join component_iocard   io    on io.id   =detail.component_id and detail.categroy_id=6
left join component_disk     disk  on disk.id =detail.component_id and detail.categroy_id=1
left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.categroy_id=3
left join component_power    power  on  power.id=detail.component_id and detail.categroy_id=5
left join component_backplane back  on  back.id =detail.component_id and detail.categroy_id=7
left join component_powerline    line    on line.id=detail.component_id  and detail.categroy_id=8
left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.categroy_id=11
left join component_other    other  on  other.id=detail.component_id and detail.categroy_id=17
left join component_barebone    bb  on  bb.id=detail.component_id and detail.categroy_id=16

left join component_base_info info  on  info.id=mem.base_info_id
                  or  info.id=io.base_info_id
                  or  info.id=disk.base_info_id
                  or  info.id=cpu.base_info_id
                  or  info.id=power.base_info_id
                  or  info.id=back.base_info_id
                  or  info.id=line.base_info_id
                  or  info.id=other.base_info_id
                  or  info.id=ac.base_info_id
                  or  info.id=bb.base_info_id
where detail.template_id in(0,1,2) and detail.categroy_id in (1,2,3,5,6,7,8,11,16,17) and so.id='${localStorage.solutionId}'
 
 union all
 
 select DISTINCT ps.software_PN,ps.software_FC,ps.categroy_id,ss.software_categroy,ps.software_des,ss.qty,ps.purchase
 from (select * from component_software where id in(select carry_software_id from software_software where choice_software_id in (select cs.id from component_software cs where cs.id in(select ppd.component_id from product_programme_detail ppd,component_categroy cc where  ppd.categroy_id=cc.id AND ppd.categroy_id  in(13,14,15) AND cc.is_software=1 AND ppd.template_id in(0,1,2)))) AND software_type !=3) ps LEFT JOIN software_software ss ON ps.id=ss.carry_software_id
 
 
 
 
 
 `;
      //       const SQL = `select mem_des from component_memory`;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          for (let i = 0; i < res.length; i++) {
            console.log('>>>>>>>>>>>>', localStorage.templateId);
            console.log('>>>>>>>>>>>>', res);
            this.showLists = res;
            this.showLists[i].nums = i + 1;
          }
        }
      });
    },
    getHDWList() {
      // 获取数据
      const SQL = `select detail.component_count,info.listprice_onshore from component_base_info info
																													join component_cpu cpu on info.id = cpu.base_info_id
																												  join product_programme_detail detail on cpu.id=detail.component_id and  detail.																																	categroy_id=3
																												 	left join component_categroy   cate  on  cate .id=cpu.category_id
						
																													
																													left join solution so            on  so.id = detail.solution_id

																													where info.id in (select cpu.base_info_id from component_cpu cpu
																													where cpu.id in (select component_id from product_programme_detail)	) and so.id=1
			
							union
							
						select detail.component_count,info.listprice_onshore from component_base_info info
																												join component_iocard io on info.id = io.base_info_id
																												 join product_programme_detail detail on io.id=detail.component_id and  detail.																																	categroy_id=6
																												
																												left join solution so            on  so.id = detail.solution_id
																												where info.id in (select io.base_info_id from component_iocard io
																												where io.id in (select component_id from product_programme_detail)	) and so.id=1
						
							union
						
						select detail.component_count,info.listprice_onshore from component_base_info info
																													join component_disk disk on info.id = disk.base_info_id
																													join product_programme_detail detail on disk.id=detail.component_id and  detail.																																	categroy_id=4
																													
																													left join solution so            on  so.id = detail.solution_id
																													where info.id in (select disk.base_info_id from component_disk disk
																													where disk.id in (select component_id from product_programme_detail)	) and so.id=1
						
							union
	
							
						select detail.component_count,info.listprice_onshore from component_base_info info
																													join component_power power on info.id = power.base_info_id
																													join product_programme_detail detail on power.id=detail.component_id and  detail.																																	categroy_id=5
																												
																													left join solution so            on  so.id = detail.solution_id
																													where info.id in (select power.base_info_id from component_power power
																													where power.id in (select component_id from product_programme_detail)	) and so.id=1
							
							union
							
						select detail.component_count,info.listprice_onshore from component_base_info info
																											 join component_memory mem on info.id = mem.base_info_id
																											 join product_programme_detail detail on mem.id=detail.component_id and  detail.																																	categroy_id=2
																											
																												left join solution so            on  so.id = detail.solution_id
																												where info.id in (select mem.base_info_id from component_memory mem
																												where mem.id in (select component_id from product_programme_detail)	) and so.id=1
							
						union
						
						select detail.component_count,info.listprice_onshore from component_base_info info
																													join component_backplane back on info.id = back.base_info_id
																												 join product_programme_detail detail on back.id=detail.component_id and  detail.																																	categroy_id=7
																											
																												 left join solution so            on  so.id = detail.solution_id
																													where info.id in (select back.base_info_id from component_backplane back
																													where back.id in (select component_id from product_programme_detail)	) and so.id=1`;
      //       const SQL = `select mem_des from component_memory`;
      let numall = 0;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          for (let i = 0; i < res.length; i++) {
            numall += (res[i].component_count) * 1 * (res[i].listprice_onshore) * 1;
          }
          this.HDWnum = numall;
          this.HDWnumDis = this.HDWnum * 0.1;
        }
      });
    },
    getSFWList() {
      // 获取数据
      const SQL = `select det.component_count,cs.purchase from component_software cs
                  left join component_categroy        cate on cate.id=cs.categroy_id
                  left join product_programme_detail  det  on det.categroy_id=cate.id and det.component_id=cs.id
                  left join solution                  so   on so.id=det.solution_id
                  where det.categroy_id in(13,14,15)                and so.id=1`;
      //       const SQL = `select mem_des from component_memory`;
      let numall = 0;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          for (let i = 0; i < res.length; i++) {
            if (isNaN(res[i].component_count) || isNaN(res[i].purchase)) {
              console.log(res[i].component_count, res[i].purchase);
              numall += 0;
            } else {
              numall += (res[i].component_count) * 1 * (res[i].purchase) * 1;
            }

          }
          this.FSWnum = numall;
          this.FSWnumDis = this.FSWnum * 0.1;
          console.log(this.FSWnum, this.FSWnumDis);
        }
      });
      this.setMACList();
    },
    setMACList() { // 总价计算
      const sql = `select info.component_PN,info.component_FC,info.name,info.description,detail.component_count,info.listprice_onshore,act.code_activation,detail.id from component_base_info info
																													join component_cpu cpu on info.id = cpu.base_info_id
																												  join product_programme_detail detail on cpu.id=detail.component_id and  detail.																																	categroy_id=3
																												 	left join component_categroy   cate  on  cate .id=cpu.category_id
						
																											
																													left join solution so            on  so.id = detail.solution_id
																													left join component_cpu_activation act on act.id=cpu.cpu_activation_id

																													where info.id in (select cpu.base_info_id from component_cpu cpu
																													where cpu.id in (select component_id from product_programme_detail)	) and so.id=1

							
							union
							
						select info.component_PN,info.component_FC,info.name,info.description,detail.component_count,info.listprice_onshore,detail.status ,detail.id from component_base_info info
																												left join component_iocard io on info.id = io.base_info_id
																												 left join product_programme_detail detail on io.id=detail.component_id and  detail.																																	categroy_id=6
																											
																												left join solution so            on  so.id = detail.solution_id
																												where info.id in (select io.base_info_id from component_iocard io
																												where io.id in (select component_id from product_programme_detail)	) and so.id=1
						
							union
						
						select info.component_PN,info.component_FC,info.name,info.description,detail.component_count,info.listprice_onshore,detail.status ,detail.id from component_base_info info
																													join component_disk disk on info.id = disk.base_info_id
																													join product_programme_detail detail on disk.id=detail.component_id and  detail.																																	categroy_id=4
																													
																													left join solution so            on  so.id = detail.solution_id
																													where info.id in (select disk.base_info_id from component_disk disk
																													where disk.id in (select component_id from product_programme_detail)	) and so.id=1
						
							union
	
							
						select info.component_PN,info.component_FC,info.name,info.description,detail.component_count,info.listprice_onshore,detail.status ,detail.id from component_base_info info
																													join component_power power on info.id = power.base_info_id
																													join product_programme_detail detail on power.id=detail.component_id and  detail.																																	categroy_id=5
																													
																													left join solution so            on  so.id = detail.solution_id
																													where info.id in (select power.base_info_id from component_power power
																													where power.id in (select component_id from product_programme_detail)	) and so.id=1
							
							union
							
						select info.component_PN,info.component_FC,info.name,info.description,detail.component_count,info.listprice_onshore,detail.status ,detail.id from component_base_info info
																											 join component_memory mem on info.id = mem.base_info_id
																											 join product_programme_detail detail on mem.id=detail.component_id and  detail.																																	categroy_id=2
																											
																												left join solution so            on  so.id = detail.solution_id
																												where info.id in (select mem.base_info_id from component_memory mem
																												where mem.id in (select component_id from product_programme_detail)	) and so.id=1
							
						union
						
						select info.component_PN,info.component_FC,info.name,info.description,detail.component_count,info.listprice_onshore,detail.status,detail.id from component_base_info info
																													join component_backplane back on info.id = back.base_info_id
																												 join product_programme_detail detail on back.id=detail.component_id and  detail.																																	categroy_id=7
																												
																												 left join solution so            on  so.id = detail.solution_id
																													where info.id in (select back.base_info_id from component_backplane back
																													where back.id in (select component_id from product_programme_detail)	) and so.id=1`;
      let allNum = null;
      this.$db.all(sql, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          for (let i = 0; i < res.length; i++) {
            const num = res[i].component_count * res[i].listprice_onshore;
            allNum += num;
            // console.log(num);
          }
          this.MACnum = allNum;
          this.MACnumDis = this.MACnum * 0.1;
          // console.log(this.showdata, allNum);
        }
      });
    },
  },
  mounted(){

  },
  created() {

    // 钩子函数渲染数据
    this.getDataList();
    this.getHDWList();
    this.getSFWList();
    this.getDataListnum();
  },
};
</script>

<style scoped lang="scss">
  * {
    list-style: none;
    box-sizing: border-box;
  }
  .el-table th, .el-table tr{
    background: transparent;
  }
  .listtap{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .goBack{
      display: inline-block;
    }
  }
  .wrap {
    width: 100%;
    padding: 20px;
    ul {
      width: 100%;
      display: flex;

      li {
        padding-right: 12px;
      }
    }
  }
  .LISTmain{
    padding-bottom: 20px;
    li{
      padding-left: 12px;
    }
  }
  .tsLists{
    width: 90%;
    border-bottom: 1px solid #e7e7e7;
    line-height: 45px;
    .numLIST{
      width: 100%;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      li{
        flex: 1;
        width: 100%;
      }
    }
    /deep/.el-input__inner{
      background:rgb(245,245,245);
      border:none;
      border-bottom:1px solid #DCDFE6;
      border-radius:0px;
    }
  }
  .el-table__body-wrapper{
    background: #f5f5f5 !important;
  }
  element .style{
    background: #f5f5f5 !important;
  }
  .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
    background-color: inherit !important;
  }
  .intro-list{
    background-color: inherit !important;
  }
  .intro-list .el-table th, .el-table tr{
    background: #f5f5f5 !important;
  }

  .grid-content {
    padding: 20px 20px;
    .el-input {
      width: 40%;
    }
  }

</style>
