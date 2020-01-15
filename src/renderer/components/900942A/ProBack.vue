<template>
  <!--设置详情-->
  <div class="wrap">
    <div class="listtap">
      <!--<div>{{$t('Proback.machinetitle')}}{{this.$route.query.machineId}} - {{$t('Proback.inventory')}}</div>-->
      <div>{{this.$route.query.name}} - {{$t('Proback.inventory')}}</div>
      <button class="el-button el-button--primary el-button--small" @click="goBack">{{$t('Proback.back')}}</button>
    </div>
    <div v-show="$store.state.userId !=1">
      <!--硬件-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
            <div class="grid-content">{{$t('Proback.hardware.title')}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">{{$t('Proback.software.list.TotalPrice')}}：￥{{totalPrice1 | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.software.list.Discount')}}：
              <el-input v-model="input2"  @change="discountData1(totalPrice1,input2,input3,1)" @keyup.native="changeNum(1)"></el-input>
              %off
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.software.list.DiscountedPrice')}}：￥
              <el-input v-model="input3"  @change="getDiscountPrice1(totalPrice1,input2,input3,1)" disabled></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--软件-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
          <div class="grid-content">{{$t('Proback.software.title')}}</div>
        </el-col>
          <el-col :span="5">
            <div class="grid-content">{{$t('Proback.hardware.list.TotalPrice')}}：￥{{totalPrice | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.hardware.list.Discount')}}：
              <el-input v-model="input" @change="discountData(totalPrice,input,input1,2)"  @keyup.native="changeNum(2)"></el-input>
              %off
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.hardware.list.DiscountedPrice')}}：￥
              <el-input v-model="input1" @change="getDiscountPrice(totalPrice,input,input1,2)" disabled></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--机器-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
            <div class="grid-content">{{$t('Proback.machinename.title')}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content">{{$t('Proback.machinename.list.TotalPrice')}}：￥{{totalPrice2 | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.machinename.list.Discount')}}：
              <el-input v-model="input4"  @change="discountData2(input4)" disabled="disabled"></el-input>
              %off
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content"> {{$t('Proback.machinename.list.DiscountedPrice')}}：￥{{input5 | totalPriceFilters}}</div>
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
            <div class="grid-content">{{$t('Proback.aggregate.TotalMachinePrice')}}:￥{{totalPrice3 | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.aggregate.quantity')}}：
              <el-input v-model="input6" @change="discountData3(input6)"  @keyup.native="changeNum(3)"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content"> {{$t('Proback.aggregate.discountedprice')}}：￥{{input7 | totalPriceFilters}}</div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--table表格-->
    <div class="affs">
      {{$t('CompleteTheConfiguration.lists.hardware.title')}}
    </div>
    <div class="addline">
      <el-table :data="showLists" style="width: 100%">
        <el-table-column align="center" type="index"
                         :label="$t('Software.details.list.serialNumber')" width="80">
        </el-table-column>
        <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="template_name" label="FC" width="110">
        </el-table-column>
        <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" width="110" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="description_en" :label="$t('Software.details.list.describingAccessories')" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
        </el-table-column>
        <el-table-column align="center" prop="total_price" :label="$t('Software.details.list.price')" width="180">
          　<template slot-scope="scope">
          　　　<span v-show="$store.state.userId !=1">{{scope.row.total_price | totalPriceFilters}}</span>
          　　　<span v-show="$store.state.userId ==1">- -</span>
          　</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="affs">
      {{$t('CompleteTheConfiguration.lists.software.title')}}
    </div>
    <div class="addline">
      <el-table :data="showListsData" style="width: 100%">
        <el-table-column align="center" type="index"
                         :label="$t('Software.details.list.serialNumber')" width="80">
        </el-table-column>
        <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="template_name" label="FC" width="110">
        </el-table-column>
        <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" width="110" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="description_en" :label="$t('Software.details.list.describingAccessories')" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
        </el-table-column>
        <el-table-column align="center" prop="total_price" :label="$t('Software.details.list.price')" width="180">
          　<template slot-scope="scope">
          　　　<span v-show="$store.state.userId !=1">{{scope.row.total_price | totalPriceFilters}}</span>
          　　　<span v-show="$store.state.userId ==1">- -</span>
          　</template>
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
      //用户id
      userId:0,
     // 硬件
      input: 10,
      input1: 0,
      totalPrice: '',


      // 软件
      input2: 10,
      input3: 0,
      totalPrice1: '',
      ogrDiscount:0,
      ogrDiscount1:0,

      // 机器
      input4: 0,
      input5: '',
      totalPrice2: '',


      // 机器总价
      input6: 1,
      input7: '',
      totalPrice3: '',


      // 选择列表
      options: [],
      showLists: [],
      showListsData: [],


      MACadd: 0,
      MACaddDis: 0,
      allNums: 0,
      allNum: 0,
      discount: 0.1,
      machine: 1,
      endNum: 0
    };
  },

  filters:{
    // 列表总价过滤器：加￥符号、保留两位小数四舍五入、使用分位分隔符
    totalPriceFilters:function (value) {
      if (!isNaN(value)) {
        return  Number(value).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
      }else{
        return 'N/C'
      }
    }
  },
  methods: {

    /*限制input 输入 英文*/
    changeNum(flag) {
      if(flag == 1 ){
        this.input2 = this.input2.replace( /[^\.\d]/g, '');
        //this.input2 = this.input2.replace('.', '');
      }

      if(flag == 2 ){
        this.input = this.input.replace( /[^\.\d]/g, '');
        //this.input = this.input.replace('.', '');
      }

      if(flag == 3){
        this.input6 = this.input6.replace( /[^\.\d]/g, '');
        this.input6 = this.input6.replace('.', '');
      }

    },

    /*硬件 输入 折扣 算出 折扣价*/
    discountData1(total,discount,totalDiscount,num) {
      if (discount < 100 && discount >= 0) {
        /*往库里计算时，0转100*/
        if(discount == 0){
          discount = 100
        }

        this.input2 = Number(this.input2).toFixed(2) // 当前折扣  保留2位
        this.input3 = Number(this.totalPrice1 * ((discount) / 100)).toFixed(2) ; // 当前折扣价  保留2位

        this.mediumHardDiskData(total,discount,totalDiscount,num);
        let input1 = parseFloat(this.input1); // tofixed  是字符串  需要转 number
        let input3 = parseFloat(this.input3);  // tofixed  是字符串  需要转 number

        /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
        this.input5 = input1+input3;
        this.input7 = input1+input3;
        /* 机器 总折扣 */
        this.input4 = Number((this.input5 / this.totalPrice2) *100).toFixed(2);
        /*折扣可以输入 0 所以 需要 100 转 0  */
        if(this.input4=='100.00'){
          this.input4 = '0.00'
        }
        if(discount == 100){
          discount = 0
        }
        /*记录 上一次 折扣 */
        this.ogrDiscount1 = Number(discount).toFixed(2);
      } else {
        /*赋值 上一次的折扣*/
        this.input = this.ogrDiscount1;
        this.$message({
          message: '请输入正确折扣价',
          type: 'warning',
        });
      }
    },

    /*软件 输入 折扣 算出 折扣价*/
    discountData(total,discount,totalDiscount,num) {
      if (discount < 101 && discount >= 0) {
        /*往库里计算时，0转100*/
        if(discount == 0){
          discount = 100
        }
        this.input = Number(this.input).toFixed(2) // 当前折扣  保留2位
        this.input1 = Number(this.totalPrice * (discount / 100)).toFixed(2); // 当前折扣价  保留2位
        this.mediumHardDiskData(total,discount,totalDiscount,num);
        let input1 = parseFloat(this.input1); // tofixed  是字符串  需要转 number
        let input3 = parseFloat(this.input3); // tofixed  是字符串  需要转 number

        /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
        this.input5 =input1+input3;
        this.input7 =input1+input3;
        /* 机器 总折扣 */
        this.input4 = Number((this.input5 / this.totalPrice2)  *100).toFixed(2);
        /*折扣可以输入 0 所以 需要 100 转 0  */
        if(this.input4=='100.00'){
          this.input4 = '0.00'
        }
        if(discount == 100){
          discount = 0
        }
        /*记录 上一次 折扣 */
        this.ogrDiscount = Number(discount).toFixed(2);
      } else {
        /*赋值 上一次的折扣*/
        this.input = this.ogrDiscount;

        this.$message({
          message: '请输入正确折扣',
          type: 'warning',
        });
      }
    },

    mediumHardDiskData(total,discount,totalDiscount,num) {
      /*折扣 保留后两位*/
      let dis = Number(discount).toFixed(2); // 折扣保留2位
      let discountPriceRMB = parseFloat(dis); //折扣转 number
      let tot = 0

      /*num 1为硬件  2为 软件*/
      if(num ==1){
        // 1为硬件  折扣价
        tot = parseFloat(this.input3) ;
      }else{
        // 2为软件  折扣价
        tot = parseFloat(this.input1) ;
      }
      console.log(total,dis,tot,num)

      // 当 折扣为 100  往库里 存0
      if(discountPriceRMB == 100){
        discountPriceRMB = 0
      }

      const updateSql = `UPDATE machine_price_detail set 'product_id'='${this.$route.query.productId}',solution_id='${this.$route.query.solutionId}',discount='${discountPriceRMB}',discount_price='${tot}' where machine_id = '${this.$route.query.machineId}' and configure_type='${num}'`
      console.log(updateSql)
      this.$db.run(updateSql, (err, res) => {
        if (res) {
          console.log("修改失败")
        } else {
          console.log("修改成功")
        }
      })
    },

    /*硬件 输入 折扣价 算出 折扣*/
    getDiscountPrice(total,discount,totalDiscount,num) {
      this.input = 100 - totalDiscount / this.totalPrice * 100;
      this.mediumHardDiskData(total,discount,totalDiscount,num);
    },
    /*软件 输入 折扣价 算出 折扣*/
    getDiscountPrice1(total,discount,totalDiscount,num) {
      this.input2 = 100 - totalDiscount / this.totalPrice1 * 100;
      this.mediumHardDiskData(total,discount,totalDiscount,num);
    },

    /*机器 输入 折扣价 算出 折扣*/
    getDiscountPrice2(num) {
      this.input4 = 100 - num / this.totalPrice2 * 100;
    },
    /*机器 输入 折扣 算出 折扣价*/
    discountData2(num) {
      if (num < 100 && num > 9) {
        this.input5 = this.totalPrice2 * (100 - num) / 100;
      } else {
        this.$message({
          message: '请输入正确折扣',
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
      const updateSql = `update machine_info set count='${num}' where id='${this.$route.query.machineId}'`
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
      from machine_info pp  join product_info product on product.id=pp.product_id where product.id=${this.$route.query.productId} and pp.id = ${this.$route.query.machineId} `;
      this.$db.get(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          this.machine = res.count;

          const SQLData = `SELECT list_price,configure_type,discount,discount_price FROM "machine_price_detail" where
      product_id='${this.$route.query.productId}' and solution_id='${this.$route.query.solutionId}' and machine_id='${this.$route.query.machineId}'`;
          this.$db.all(SQLData, (err, res) => {
            console.log(SQLData,res)
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: '搜索失败',
                desc: err,
              });
            } else {
              console.log(res)
              res.forEach((item)=>{

                //获取硬件价格
                if(item.configure_type == 1){
                  this.totalPrice1 = item.list_price;
                  this.input2 = Number(item.discount).toFixed(2);
                  this.ogrDiscount1 = Number(item.discount).toFixed(2);
                  this.input3 = Number(item.discount_price).toFixed(2);
                }
                // 获取软件价格
                if(item.configure_type == 2){

                  this.totalPrice = item.list_price;
                  this.input = Number(item.discount).toFixed(2);
                  this.ogrDiscount = Number(item.discount).toFixed(2);
                  this.input1 = Number(item.discount_price).toFixed(2);
                }
                console.log(item)
              })
              /*  机器价格 = 硬价价格 + 软件价格*/
              this.totalPrice2 = this.totalPrice1 + this.totalPrice;
              this.totalPrice3 = this.totalPrice1 + this.totalPrice;

              //this.input1 = this.totalPrice * ((100 - this.input) / 100);
              //this.input3 = this.totalPrice1 * ((100 - this.input2) / 100);

              /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
              let rmb = parseFloat(this.input1);
              let rmbNum = parseFloat(this.input3);
              this.input5 = rmb + rmbNum;
              this.input7 = rmb + rmbNum;

              /*整台机器折扣价*/
              this.input4 = Number((this.input5 / this.totalPrice2) * 100).toFixed(2);
              if(this.input4=='100.00'){
                this.input4 = '0.00'
              }

              /*赋值 库里获取的折扣*/
              this.input6 = this.machine+'';
              this.totalPrice3 = (this.totalPrice2 * this.machine).toFixed(2);
              this.input7 = (this.input5 * this.machine).toFixed(2);
            }
          });
        }
      });

      this.$store.commit('changeMachine', this.machine);
    },
    goBack() {
      this.$router.push({ // 核心语句
        path: '/Projectpar', // 跳转的路径
        query: { // 路由传参时push和query搭配使用 ，作用时传递参数
          // id: 0,
        },
      });
    },

     getDataList() {
      // 获取列表全数据
      const rowSQL = `select info.component_PN,info.component_FC,detail.category_id,info.name,info.category_name,info.description,info.description_en,
                 detail.component_count,info.listprice_onshore,info.listprice_offshore,info.ui_status,info.withdraw_date
                 from product_programme_detail detail
                 left join solution           so     on  so.id=detail.solution_id
                 left join component_category cate  on  cate.id =detail.category_id
                 left join component_memory   mem   on  mem.id =detail.component_id and detail.category_id=2
                 left join component_iocard   io    on io.id   =detail.component_id and detail.category_id=6
                 left join component_disk     disk  on disk.id =detail.component_id and detail.category_id=1
                 left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.category_id=3
                 left join component_power    power  on  power.id=detail.component_id and detail.category_id=5
                 left join component_backplane back  on  back.id =detail.component_id and detail.category_id=7
                 left join component_powerline    line    on line.id=detail.component_id  and detail.category_id=8
                 left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.category_id=11
                 left join component_other    other  on  other.id=detail.component_id and detail.category_id=other.category_id
                 left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=16
                 left Join component_powerconversion con on con.id=detail.component_id and detail.category_id=22
                 left Join component_expansioncase exp_case on exp_case.id=detail.component_id and detail.category_id=23
                 left Join component_expansionflesh exp_flesh on exp_flesh.id=detail.component_id and detail.category_id=24
                 left Join component_connectingline exp_line on exp_line.id=detail.component_id and detail.category_id=25
                 left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=26
                 left Join component_disk_modeoption disk_mode on disk_mode.id=detail.component_id and detail.category_id=27
                 left join component_memoryrisercard memcard on memcard.category_id = detail.category_id and memcard.id=detail.component_id
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
                     or info.id=exp_case.base_info_id
                     or info.id=exp_flesh.base_info_id
                     or info.id=exp_line.base_info_id
                     or info.id=disk_exp_case.base_info_id
                     or info.id=disk_mode.base_info_id
                     or info.id=con.base_info_id
                     or info.id=memcard.base_info_id
 where detail.template_id='${this.$route.query.templateId}' and detail.category_id in (1,2,3,5,6,7,8,11,16,17,23,24,25,26,27,22,37,12,41,39,28,38,30,31) and  detail.solution_id='${this.$route.query.solutionId}'and detail.product_id='${this.$route.query.productId}' and detail.machine_id='${this.$route.query.machineId}'`;

      //-----------------------------------软件----------------------------
      //获取软件数据（维保信息除外）
      const sqlSW =  `SELECT T1.software_category,T1.qty,cs.*,
                   (SELECT machine_model FROM product_info WHERE id = ${this.$route.query.productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${this.$route.query.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as logicNum
            FROM component_software cs
            INNER JOIN
            (SELECT
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,14,15) AND ppd.solution_id = ${this.$route.query.solutionId}
            AND ppd.template_id = ${this.$route.query.templateId} AND ppd.machine_id = ${this.$route.query.machineId} AND ppd.product_id = ${this.$route.query.productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id
            WHERE cs.software_type != 3`;
      this.$db.all(rowSQL, async  (err, res)=>{
        console.log(res, err,rowSQL);
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
           let affirmTable = [];
          res.forEach((item, index) => {
            const obj = {
              component_count: item.component_count,
              template_desc: item.description,
              description_en:item.description_en,
              name: item.name,
              nameCN: item.category_name,
              template_name: item.component_FC,
              component_id: item.component_PN,
              total_price: item.listprice_onshore * item.component_count,
              // total_price: item.listprice_onshore,
              category: item.category_id,
            };
            affirmTable.push(obj);
          });
          let data = affirmTable;
          /*合并相同 category_id 进行合并*/
          function trans(data) {
            let cache = {} // cache存储的键是eid，值是这个eid在indices数组中的下标
            let indices = [] // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
            data.forEach((item, i) => {

              let eid = item.category
              let index = cache[eid]
              if (index !== undefined) {
                indices[index].push(i)
              } else {
                cache[eid] = indices.length
                indices.push([i])
              }
            })

            let result = []
            indices.forEach(item => {
              item.forEach(index => {
                result.push(data[index]) // 依次把index对应的元素data[index]添加进去即可
              })
            })

            return result
          }
          let result = trans(data)
          /*按照指定顺序 进行排序*/
          let cur = [3,2,7,1,6,5,8,11,16,17,23,24,25,26,27,22,37,12,41,39,28,38,30,31];
          let push = [];
          for(let x in result) {
            if(in_array(result[x].category, cur)) {
              result[x]['sort'] = cur.indexOf(result[x].category);
              push.push(result[x]);
            };
          };
          push = push.sort(function(a, b) {
            if(a.sort < b.sort) {
              return -1;
            } else if(a.sort > b.sort) {
              return 1;
            }
            return 0;
          });
          affirmTable = [];
          for(let x in push) {
            affirmTable.push( push[x])
          };

          function in_array(search, array) {
            for(var i in array) {
              if(array[i] == search) {
                return true;
              }
            }
            return false;
          }
          let arr=[]
          /*如果fc相同，就将数据和并，数量相加*/
          affirmTable.forEach((item,index)=>{
            if(arr.length==0){
              return arr.push(item)
            }
            for (let i=0;i<=arr.length;i++){
              if(i==arr.length){
                return arr.push(item)
              }
              if(arr[i].template_name==item.template_name){
                return arr[i].component_count+=item.component_count
              }
            }
          })
          this.showLists = [...arr];
          console.log(arr,affirmTable)
            //筛选出HPO是否开启导出标识
            let hpoExportFlag = true;
            //获取HPO是否展示标识
            const hpoSQL =`SELECT * FROM product_programme_detail WHERE
                template_id='${this.$route.query.templateId}' and category_id = 33 and
                solution_id='${this.$route.query.solutionId}'and
                product_id='${this.$route.query.productId}' and
                machine_id='${this.$route.query.machineId}'`;
            await new Promise((resolve, reject)=> {
              this.$db.all(hpoSQL, (err, res) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(res);
                    }
                });
            }).then((data) => {
                if (data.length == 0){
                    hpoExportFlag = false;
                }
            });
          this.$db.all(sqlSW, (err, res) => {
            console.log(res, err);
            if (err) {
              this.$logger(err);
              this.$Notice.error({
                title: '搜索失败',
                desc: err,
              });
            } else {
              let tempData = [];
              let typeModelList = [];
              let hpoList = [];
              //处理分类顺序 操作系统 逻辑分区 虚拟化软件
              let sysList = [];//操作系统
              let logicList = [];//逻辑分区
              let inventList = [];//虚拟化软件
              sysList = res.filter((c) =>{
                return c.software_category == 1
              });
              logicList = res.filter((o) =>{
                return o.software_category == 0
              });
              inventList = res.filter((v) =>{
                return v.software_category == 2
              });
              res = inventList.concat(logicList).concat(sysList);
              //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
              for (let i = 0; i < res.length; i++) {
                let obj = {
                  component_count: '',
                  description_en: res[i].software_des,
                  template_desc:res[i].software_desCN,
                  name: res[i].software_category,
                  nameCN: '',
                  template_name: res[i].software_FC,
                  component_id: res[i].software_PN,
                  Classify: res[i].Classify,
                  totalPrice:res[i].purchase,
                  total_price:'',
                  qty:res[i].qty
                };
                if (obj.qty == 0){
                  obj.component_count = res[i].cpuActiveNum;
                }else{
                  obj.component_count = res[i].qty;
                }
                if (res[i].Classify == res[i].type + '-' + res[i].model) {
                  //逻辑分区
                  if (res[i].category_id == 13) {
                    obj.component_count = res[i].logicNum;
                    //操作系统
                  } else if (res[i].category_id == 14) {
                    obj.component_count = res[i].qty;
                  } else {
                    obj.component_count = res[i].cpuActiveNum;
                  }
                  typeModelList.push(obj);
                  continue;
                }
                //硬件 HPO
                if (res[i].category_id == 33 || res[i].category_id == 34) {
                  //不需要显示HPO
                    if (!hpoExportFlag){
                      continue;
                    }
                      obj.component_count = res[i].qty;
                      hpoList.push(obj);
                      continue;
                }

                tempData.push(obj);
              }
              let addirmTable=[]
              //处理hpo列表顺序
              let headerHpoList = [];
              for (let k = hpoList.length - 1; k >= 0; k--) {
                if (hpoList[k].template_name == undefined || hpoList[k].template_name == null || hpoList[k].template_name == '') {
                  headerHpoList.push(hpoList[k]);
                  hpoList.splice(k, 1);
                }
              }
              for (let m = 0; m < headerHpoList.length; m++) {
                addirmTable.push(headerHpoList[m]);
                for (let j = 0; j < hpoList.length; j++) {
                  if (headerHpoList[m].Classify == hpoList[j].Classify && headerHpoList[m].name == hpoList[j].name) {
                    addirmTable.push(hpoList[j]);
                  }
                }
              }

              //处理列表顺序
              let headerList = [];
              for (let k = tempData.length - 1; k >= 0; k--) {
                if (tempData[k].template_name == undefined || tempData[k].template_name == null || tempData[k].template_name == '') {
                  headerList.push(tempData[k]);
                  tempData.splice(k, 1);
                }
              }

              for (let m = 0; m < headerList.length; m++) {
                addirmTable.push(headerList[m]);
                for (let j = 0; j < tempData.length; j++) {
                  if (headerList[m].Classify == tempData[j].Classify && headerList[m].name == tempData[j].name) {
                    addirmTable.push(tempData[j]);
                  }
                }
              }
              addirmTable = typeModelList.concat(addirmTable);

              //维保
              const sqlSWMA = ` SELECT  ppd.component_count,ppd.category_id AS software_category,cs.*,
                  (SELECT machine_model FROM product_info WHERE id = ${this.$route.query.productId}) AS type,
                  (SELECT machine_submodel FROM product_info WHERE id = ${this.$route.query.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${this.$route.query.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as logicNum
            FROM component_software cs LEFT JOIN product_programme_detail ppd
                    ON cs.id = ppd.component_id
                    WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id = ${this.$route.query.solutionId} AND ppd.template_id = ${this.$route.query.templateId}
                    AND ppd.machine_id = ${this.$route.query.machineId}  AND ppd.product_id = ${this.$route.query.productId}`;
              this.$db.all(sqlSWMA, (err, res) => {
                console.log(res, err);
                if (err) {
                  this.$logger(err);
                  this.$Notice.error({
                    title: '搜索失败',
                    desc: err,
                  });
                } else {
                  let tempSWMAData = [];
                  res = res.reverse();
                  for (let j = 0; j < res.length; j++) {
                    let objSWMA = {
                      component_count: res[j].component_count,
                      template_desc: res[j].software_desCN,
                      description_en:res[j].software_des,
                      name: res[j].software_category,
                      nameCN: '',
                      totalPrice:res[j].purchase,
                      total_price:'',
                      template_name: res[j].software_FC,
                      component_id: res[j].software_PN,
                      Classify: res[j].Classify
                    };

                    tempSWMAData.push(objSWMA);
                  }
                  //处理列表顺序
                  let headerSWMAList = [];
                  let swmaList = [];
                  for (let k = tempSWMAData.length - 1; k >= 0; k--) {
                    if (tempSWMAData[k].template_name == undefined || tempSWMAData[k].template_name == null || tempSWMAData[k].template_name == '') {
                      headerSWMAList.push(tempSWMAData[k]);
                      tempSWMAData.splice(k, 1);
                    }
                  }
                  for (let m = 0; m < headerSWMAList.length; m++) {
                    swmaList.push(headerSWMAList[m]);
                    for (let j = 0; j < tempSWMAData.length; j++) {
                      if (headerSWMAList[m].Classify == tempSWMAData[j].Classify && headerSWMAList[m].name == tempSWMAData[j].name) {
                        swmaList.push(tempSWMAData[j]);
                      }
                    }
                  }
                  addirmTable = addirmTable.concat(swmaList);
                }
                addirmTable.forEach(item => {
                  if (item.name == 0) {
                    item.nameCN = '逻辑分区';
                    item.name = 'A logical partition';
                  } else if (item.name == 1) {
                    item.nameCN = '操作系统';
                    item.name = 'The operating system';
                  } else if (item.name == 2) {
                    item.nameCN = '应用程序';
                    item.name = 'The application';
                  } else if (item.name == 18) {
                    item.nameCN = '操作系统SWMA';
                    item.name = 'The application SWMA';
                  } else if (item.name == 19) {
                    item.nameCN = '逻辑分区SWMA';
                    item.name = 'A logical partition SWMA';
                  } else if (item.name == 20) {
                    item.nameCN = '应用程序SWMA';
                    item.name = 'The application SWMA';
                  }

                  item.total_price = item.totalPrice*item.component_count;

                });
                this.showLists = [...arr];
                this.showListsData = [...addirmTable];
              });
              console.log(addirmTable)
            }
          });
        }
        // const data = this.affirmTable;
        // /* 合并相同 category_id 进行合并*/
        // function trans(data) {
        //   const cache = {}; // cache存储的键是eid，值是这个eid在indices数组中的下标
        //   const indices = []; // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
        //   data.forEach((item, i) => {
        //
        //     const eid = item.category;
        //     const index = cache[eid];
        //     if (index !== undefined) {
        //       indices[index].push(i);
        //     } else {
        //       cache[eid] = indices.length;
        //       indices.push([ i ]);
        //     }
        //   });
        //
        //   const result = [];
        //   indices.forEach(item => {
        //     item.forEach(index => {
        //       result.push(data[index]); // 依次把index对应的元素data[index]添加进去即可
        //     });
        //   });
        //
        //   return result;
        // }
        // const result = trans(data);
        // /* 按照指定顺序 进行排序*/
        // const cur = [ 3, 2, 7, 1, 6, 5, 8, 17 ];
        // let push = [];
        // for (const x in result) {
        //   if (in_array(result[x].category, cur)) {
        //     result[x].sort = cur.indexOf(result[x].category);
        //     push.push(result[x]);
        //   }
        // }
        // push = push.sort(function(a, b) {
        //   if (a.sort < b.sort) {
        //     return -1;
        //   } else if (a.sort > b.sort) {
        //     return 1;
        //   }
        //   return 0;
        // });
        // this.affirmTable = [];
        // for (const x in push) {
        //   this.affirmTable.push(push[x]);
        // }
        //
        // function in_array(search, array) {
        //   for (const i in array) {
        //     if (array[i] == search) {
        //       return true;
        //     }
        //   }
        //   return false;
        // }
      });
    },

    getHDWList() {
      // 获取数据
      const SQL = `select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_cpu cpu on info.id = cpu.base_info_id
							join product_programme_detail detail on cpu.id=detail.component_id and  detail.category_id=cpu.category_id
							 join component_category   cate  on  cate .id=cpu.category_id
							 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
						select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_iocard io on info.id = io.base_info_id
							 join product_programme_detail detail on io.id=detail.component_id
							 and  detail.category_id = io.category_id
							 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
				select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_disk disk on info.id = disk.base_info_id
							join product_programme_detail detail on disk.id=detail.component_id
							and  detail.category_id=disk.category_id
							left join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
				select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_power power on info.id = power.base_info_id
							join product_programme_detail detail on power.id=detail.component_id
							and  detail.category_id=power.category_id
						 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
			select detail.component_count,info.listprice_onshore ,info.status from component_base_info info
						 join component_memory mem on info.id = mem.base_info_id
						 join product_programme_detail detail on mem.id=detail.component_id
						 and  detail.category_id=mem.category_id
						 left join solution so            on  so.id = detail.solution_id
						where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
						union
			select detail.component_count,info.listprice_onshore,info.status from component_base_info info
						 join component_backplane back on info.id = back.base_info_id
						 join product_programme_detail detail on back.id=detail.component_id
						 and  detail.category_id=back.category_id
						 join solution so            on  so.id = detail.solution_id
                        where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'`;
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
                  left join component_category        cate on cate.id=cs.category_id
                  left join product_programme_detail  det  on det.category_id=cate.id and det.component_id=cs.id
                  left join solution                  so   on so.id=det.solution_id
                  where det.category_id in(13,14,15)                and det.solution_id = '${localStorage.solutionId}' and det.product_id='${localStorage.productId}' and det.machine_id=${localStorage.machineId} and det.template_id='${localStorage.templateId}'`;
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
      const sql = `select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,act.code_activation,detail.id,info.status from component_base_info info
					join component_cpu cpu on info.id = cpu.base_info_id
					join product_programme_detail detail on cpu.id=detail.component_id
					and  detail.category_id=cpu.category_id
				 join solution so            on  so.id = detail.solution_id
				 join component_cpu_activation act on act.id=cpu.cpu_activation_id
			  	where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
						select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
							 join component_iocard io on info.id = io.base_info_id
							 left join product_programme_detail detail on io.id=detail.component_id
							 and  detail.category_id=io.category_id
							 join solution so            on  so.id = detail.solution_id
						where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
				select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
						join component_disk disk on info.id = disk.base_info_id
						join product_programme_detail detail on disk.id=detail.component_id
						and  detail.category_id=disk.category_id
					 join solution so            on  so.id = detail.solution_id
					where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
		select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
					join component_power power on info.id = power.base_info_id
					join product_programme_detail detail on power.id=detail.component_id
					and  detail.category_id=power.category_id
				 join solution so            on  so.id = detail.solution_id
				where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
			select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
						 join component_memory mem on info.id = mem.base_info_id
						 join product_programme_detail detail on mem.id=detail.component_id
						 and  detail.category_id=mem.category_id
						 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
						union
						select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status,detail.id,info.status from component_base_info info
								join component_backplane back on info.id = back.base_info_id
							 join product_programme_detail detail on back.id=detail.component_id
							 and  detail.category_id=back.category_id
							  join solution so            on  so.id = detail.solution_id
								where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'`;
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
  created() {
    console.log(this.$route.query,this.$route.query.product_id)
    this.userId = localStorage.userId;
    console.log('this.userId',this.userId)
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
  .affs {
    font-size: 17px;
    height: 60px;
    border-bottom: 1px solid #ccc;
    line-height: 60px;
    padding-left: 20px;
    //margin-left: 20px;
  }
</style>
