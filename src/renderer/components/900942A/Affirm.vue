<template>
    <div class="affirm">
        <!--确认组件-->
        <header>
            <b>{{$t('CompleteTheConfiguration.title')}}</b>
            <el-button type="primary" size="mini" @click="getElen()">{{$t('CompleteTheConfiguration.btnAccomplish')}}<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="reload">{{$t('CompleteTheConfiguration.btnLastStep')}}</el-button>
        </header>
        <div class="affs">
          {{$t('CompleteTheConfiguration.lists.hardware.title')}}
        </div>
        <el-table :data="affirmTable" class="component-line">
            <el-table-column align="center" type="index" :index="indexMethod"
                             :label="$t('CompleteTheConfiguration.lists.hardware.list.serialNumber')" width="80">
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
            <el-table-column align="center" prop="component_count" :label="$t('CompleteTheConfiguration.lists.hardware.list.amount')" width="100">
            </el-table-column>
        </el-table>
        <div class="affs">
          {{$t('CompleteTheConfiguration.lists.software.title')}}
        </div>
        <el-table :data="addirmTable" class="component-line">
            <el-table-column align="center" type="index" :index="indexMethod"
                             :label="$t('CompleteTheConfiguration.lists.hardware.list.serialNumber')" width="80">
            </el-table-column>
            <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
            <!--</el-table-column>-->
            <el-table-column align="center" prop="template_name" label="FC" width="110">
            </el-table-column>
            <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" v-if="$store.state.info_language" width="110">
            </el-table-column>
            <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" v-if="!$store.state.info_language" width="110">
            </el-table-column>
            <el-table-column align="center" prop="software_desCN" :label="$t('Software.details.list.describingAccessories')" v-if="!$store.state.info_language">
            </el-table-column>
            <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')" v-if="$store.state.info_language">
            </el-table-column>
            <el-table-column align="center" prop="component_count" :label="$t('CompleteTheConfiguration.lists.hardware.list.amount')" width="100">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  name: 'Affirm',
  data() {
    return {
      affirmTable: [], //
      addirmTable: [], //
    };
  },
  methods: {
    /* --------完成--------*/
    async getElen() {
      this.$router.push('/Projectpar');// 路由跳转，跳到方案详情
      const updateSql = `UPDATE machine_info set status=1 where id='${localStorage.machineId}'`;
      this.$db.run(updateSql, (err, res) => {
        if (err) {
          console.log(updateSql);
        } else {
          console.log('机器状态修改成功');
        }
      });

      // let _this = this.$db;
      // //取出id为1的solution
      // let oneSolution = this.getObjByAttributeFromList(this.$store.state.sourceData, "solutionId", 1);
      //
      // //取出solution中的所有product
      // let productList = this.getValueBykey(oneSolution, "productList");
      //
      // //待拼接的SQL
      // let insertSQL = "insert into product_programme(solution_id,product_id,templete_id,remark_name,count,discount,sale_untax,sale_tax) values ";
      // let updateSQL = "update product_programme set ";
      // let SQL = "";
      //
      // //如果product_programme_detail中不存在产品列表则直接删除product_programme表中指定方案的数据结束函数
      // if (productList == null) {
      //     //执行数据库操作
      //     _this.all("delete from product_programme where solution_id=" + 1, (err, res) => {
      //     });
      //     return;
      // }
      //
      // //去除在product_programme存在
      // // 但是在product_programme_detail中不存在的数据
      // let judgeResult = await this.selectBySql("select * from product_programme");
      //
      // // console.log(JSON.stringify(judgeResult))
      // for (let i = 0; i < judgeResult.length; i++) {
      //     let tempObj = judgeResult[i];
      //     let result = await this.selectBySql("select * from product_programme_detail where solution_id=" + tempObj.solution_id + " and product_id=" + tempObj.product_id);
      //     if (result.length == 0) {
      //         //执行数据库操作
      //         _this.all("delete from product_programme where solution_id=" + tempObj.solution_id + " and product_id=" + tempObj.product_id, (err, res) => {
      //         });
      //     }
      // }
      //
      // //取出每一个产品,拼接SQL,如果存在该条数据就更新，如果不存在就插入
      // for (let i = 0; i < productList.length; i++) {
      //
      //     //每个产品
      //     let product = productList[i];
      //
      //     //该方案下的该产品的id
      //     let product_id = product.productId;
      //
      //     //该方案该产品所使用的模版id
      //     let templete_id = 1;
      //
      //     //该方案，该产品下的名称
      //     let remark_name = product.productName;
      //
      //     //该方案下，该产品下的所有组件之和
      //     let count = 0;
      //
      //     //该方案下的该产品下所有组件的总价格
      //     let list_price = 0;
      //
      //     //该方案，该产品下的折扣
      //     let discount = 0.1;
      //
      //     //该方案下该产品的税前价格
      //     let sale_untax = -1;
      //
      //     //该方案下该产品的税前价格
      //     let sale_tax = -1;
      //
      //     //取出每一个产品下的分类组件列表
      //     let componentTypeList = this.getValueBykey(productList[i], "componentTypeList");
      //
      //     for (let j = 0; j < componentTypeList.length; j++) {
      //
      //         let componentList = componentTypeList[j].componentList;
      //
      //         for (let k = 0; k < componentList.length; k++) {
      //             //每个组件
      //             let component = componentList[k];
      //             count += component.component_count;
      //             list_price += (component.total_price * component.component_count);
      //         }
      //     }
      //
      //     sale_untax = list_price.toFixed(2);
      //     sale_tax = (sale_untax * 0.3).toFixed(2);
      //
      //     //查询product_programme中的指定方案下的数据
      //     let backupProductProgrammer = await this.selectBySql("select * from product_programme where solution_id=" + 1 + " and product_id=" + product_id);
      //
      //     //返回数据不为空,更新操作
      //     if (backupProductProgrammer.length > 0) {
      //         // let productProgram = backupProductProgrammer[0];
      //         SQL = updateSQL + " templete_id=" + templete_id + ",remark_name='" + remark_name + "',count=" + count +  ",discount=" + discount + ",sale_untax=" + sale_untax + ",sale_tax=" + sale_tax + " where solution_id=" + 1 + " and product_id=" + product_id;
      //         //执行数据库操作
      //         // console.log("SQL执行" + SQL)
      //         _this.all(SQL, (err, res) => {
      //             if (err) {
      //                 // console.log("SQL执行异常：" + SQL);
      //             }
      //         });
      //         //插入操作
      //     } else {
      //         SQL = insertSQL + " (" + 1 + "," + product_id + "," + templete_id + ",'" + remark_name + "'," + count + ","  + discount + "," + sale_untax + "," + sale_tax + " )";
      //         //执行数据库操作
      //         // console.log("SQL执行" + SQL)
      //         _this.all(SQL, (err, res) => {
      //             if (err) {
      //                 // console.log("SQL执行异常" + SQL);
      //             }
      //         });
      //     }
      //     SQL = "";
      // }

      /* -----------后端的内容------------*/
    },
    /**
             * 判断list中是否存在属性名是idName并且属性值为idValue如果有，返回所在list中的位置
             * @param list 被判断的list
             * @param idName 被判断的ID名称
             * @param idValue 被判断的id值
             * @return 判断当前list中是否存在某个对象的属性名为idName，属性值为idValue的对象，如果存在就返回该对象在数组中的位置，如果不存在就返回null
             */
    isInList(list, idName, idValue) {
      for (let i = 0; i < list.length; i++) {

        // console.log(JSON.stringify(list[i][idName]))
        // 如果取得
        if (list[i][idName] == idValue) {
          // 返回该idName所在的位置id
          return i;
        }
      }
      console.log('idValue: ' + idValue);
      return null;
    },

    /**
             * sql查询方法封装，只需要一个sql语句即可完成数据返回
             * @param SQL 需要被执行的SQL语句
             * @return 返回list类型查询结果，查询出错则返回null
             * 使用时注意判断是否查询出错，在返回值不为null的情况下再进行数据处理
             * 此方法的使用依赖于异步实现，如有疑问可询问 by 海洋 2019年9月12日 09:03:43
             */
    async selectBySql(SQL) {

      console.log('当前SQL:  ' + SQL);

      const _this = this.$db;
      let selectResult;
      await new Promise(function(resolve, reject) {
        // 数据库查询
        _this.all(SQL, (err, res) => {
          if (err) {
            resolve(null);
          } else {
            resolve(res);
          }
        });
      }).then(data => {
        selectResult = data;
      });
      return selectResult;
    },
    /**
             * 如果调用者确定通过SQL查询出的结果为一个对象，则调用该方法
             * @param SQL 需要被执行的SQL
             * @return 返回一个对象，如果查询失败或查询不到则返回null
             * */
    async selectOneObject(SQL) {
      const tempValue = await this.selectBySql(SQL);
      if (tempValue instanceof Array && tempValue.length == 1) {
        return tempValue[0];
      }
      return null;
    },
    /**
             * 从list中得到属性名为valueName的属性值与指定值value相等的对象中所持有的数组
             * @param sourceList    showList数据
             * @param  valueName 属性名
             * @param value 参照值
             * @returns 从list中返回一个属性名为attrName，属性值为attrValue的对象，如果查不到就返回null
             * 此方法有点绕，如有疑问可询问我 By 海洋 2019年9月12日 12:01:00
             */
    getObjByAttributeFromList(sourceList, attrName, attrValue) {
      for (let i = 0; i < sourceList.length; i++) {
        if (sourceList[i][attrName] == attrValue) {
          return sourceList[i];
        }
      }
      return null;
    },
    /**
             * 该方法的作用取得给定对象key对应的的值，应用于动态取值
             * @param obj obj的数据源
             * @param key   json数据源中的key
             * @return 返回obj.key的结果
             */
    getValueBykey(obj, key) {
      try {
        return obj[key];
      } catch (e) {
        return null;
      }
    },

    /* -----------返回上一页------------*/
    reload() {
        this.$router.push({path:'/Downen/Logic',query:{id:0}});
      //this.$router.go(-1);
    },
    indexMethod(index) {
      return index + 1;
    },
  },
  async created() {
    const rowSQL = `select info.component_PN,info.component_FC,detail.id detail_id,detail.category_id,info.name,info.category_name,info.description,info.description_en,info.listprice_onshore,info.listprice_offshore,
                detail.component_count,info.listprice_onshore,info.ui_status,info.withdraw_date
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
\t\t\t\t   or  info.id=bb.base_info_id
                     or info.id=exp_case.base_info_id
                     or info.id=exp_flesh.base_info_id
                     or info.id=exp_line.base_info_id
                     or info.id=disk_exp_case.base_info_id
                     or info.id=disk_mode.base_info_id
                     or info.id=con.base_info_id
                     or info.id=memcard.base_info_id
            where detail.template_id='${localStorage.templateId}' and detail.category_id in (1,2,3,5,6,7,8,11,16,17,23,24,25,26,27,22,37,12,41,39,28,38,30,31) and  detail.solution_id='${localStorage.solutionId}'and detail.product_id='${localStorage.productId}' and detail.machine_id='${localStorage.machineId}'`;
    this.$db.all(rowSQL, (err, res) => {
     // console.log(res, err,rowSQL);
      if (err) {
        this.$logger(err);
        this.$Notice.error({
          title: '搜索失败',
          desc: err,
        });
      } else {
        this.affirmTable = [];
        res.forEach((item, index) => {
          const obj = {
            component_count: item.component_count,
            template_desc: item.description,
            description_en:item.description_en,
            name: item.name,
            nameCN: item.category_name,
            template_name: item.component_FC,
            component_id: item.component_PN,
            // total_price: item.listprice_onshore,
            category: item.category_id,
          };
          this.affirmTable.push(obj);
        });
          let data = this.affirmTable;
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
          let cur = [3, 2, 7, 1, 6, 5, 8, 11, 16, 17, 23, 24, 25, 26, 27, 22, 37, 12, 41, 39, 28, 38, 30, 31];
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
          this.affirmTable = [];
          for(let x in push) {
              this.affirmTable.push( push[x])
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
          this.affirmTable.forEach((item,index)=>{
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
          this.affirmTable=arr
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
      //筛选出HPO是否开启导出标识
      let hpoExportFlag = true;
      //获取HPO是否展示标识
      const hpoSQL =`SELECT * FROM product_programme_detail WHERE
                template_id='${localStorage.templateId}' and category_id = 33 and
                solution_id='${localStorage.solutionId}'and
                product_id='${localStorage.productId}' and
                machine_id='${localStorage.machineId}'`;
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

      const SQL = `select  distinct cs.id,cs.software_PN,cs.software_FC,ss.software_category,cs.software_des,ss.qty,cs.purchase,cs.Classify,cs.category_id,
                   (SELECT machine_model FROM product_info WHERE id = ${localStorage.productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as logicNum
            from (
         select * from component_software where id in (
         select  carry_software_id from software_software where choice_software_id in (
         select id from component_software where id in (
         select component_id from product_programme_detail where category_id in (21,14,15)
                                                  and product_id='${localStorage.productId}'
                                                  and machine_id='${localStorage.machineId}'
                                                  and solution_id='${localStorage.solutionId}'
                                                  and template_id='${localStorage.templateId}'
         )
          )
         ) and software_type !=3
         ) cs left join software_software ss on ss.carry_software_id= cs.id

union
select distinct cs.id,cs.software_PN,cs.software_FC,cs.category_id,cs.software_des,detail.component_count,cs.purchase ,cs.Classify,cs.category_id,
             (SELECT machine_model FROM product_info WHERE id = ${localStorage.productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as logicNum
            from (
select *
from component_software  where id in(select component_id from product_programme_detail where category_id in(18,19,20) and template_id='${localStorage.templateId}'and solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'))cs left join product_programme_detail detail on detail.component_id = cs.id WHERE detail.machine_id = '${localStorage.machineId}'`;
    //-----------------------------------软件----------------------------
      //获取软件数据（维保信息除外）
      const sqlSW =  `SELECT T1.software_category,T1.qty,cs.*,
                   (SELECT machine_model FROM product_info WHERE id = ${localStorage.productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as logicNum
            FROM component_software cs
            INNER JOIN
            (SELECT
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,14,15) AND ppd.solution_id = ${localStorage.solutionId}
            AND ppd.template_id = ${localStorage.templateId} AND ppd.machine_id = ${localStorage.machineId} AND ppd.product_id = ${localStorage.productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id
            WHERE cs.software_type != 3`;


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
                      template_desc: res[i].software_des,
                      software_desCN:res[i].software_desCN,
                      name: res[i].software_category,
                      nameCN: '',
                      template_name: res[i].software_FC,
                      component_id: res[i].software_PN,
                      Classify: res[i].Classify,
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
              //处理hpo列表顺序
              let headerHpoList = [];
              for (let k = hpoList.length - 1; k >= 0; k--) {
                  if (hpoList[k].template_name == undefined || hpoList[k].template_name == null || hpoList[k].template_name == '') {
                      headerHpoList.push(hpoList[k]);
                      hpoList.splice(k, 1);
                  }
              }
              for (let m = 0; m < headerHpoList.length; m++) {
                  this.addirmTable.push(headerHpoList[m]);
                  for (let j = 0; j < hpoList.length; j++) {
                      if (headerHpoList[m].Classify == hpoList[j].Classify && headerHpoList[m].name == hpoList[j].name) {
                          this.addirmTable.push(hpoList[j]);
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
                  this.addirmTable.push(headerList[m]);
                  for (let j = 0; j < tempData.length; j++) {
                      if (headerList[m].Classify == tempData[j].Classify && headerList[m].name == tempData[j].name) {
                          this.addirmTable.push(tempData[j]);
                      }
                  }
              }
              this.addirmTable = typeModelList.concat(this.addirmTable);
              //维保
              const sqlSWMA = ` SELECT  ppd.component_count,ppd.category_id AS software_category,cs.*,
                  (SELECT machine_model FROM product_info WHERE id = ${localStorage.productId}) AS type,
                  (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as logicNum
            FROM component_software cs LEFT JOIN product_programme_detail ppd
                    ON cs.id = ppd.component_id
                    WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id = ${localStorage.solutionId} AND ppd.template_id = ${localStorage.templateId}
                    AND ppd.machine_id = ${localStorage.machineId}  AND ppd.product_id = ${localStorage.productId}`;
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
                              component_count:  res[j].component_count,
                              template_desc: res[j].software_des,
                              software_desCN:res[j].software_desCN,
                              name: res[j].software_category,
                              nameCN: '',
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
                      this.addirmTable = this.addirmTable.concat(swmaList);

                  }
                  this.addirmTable.forEach(item => {
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

                  });
              });
          }
      });
    // this.$db.all(SQL, (err, res) => {
    //   console.log(res, err,SQL);
    //   if (err) {
    //     this.$logger(err);
    //     this.$Notice.error({
    //       title: '搜索失败',
    //       desc: err,
    //     });
    //   } else {
    //     this.addirmTable = [];
    //     const arr = [];
    //       for (let i = 0; i < res.length; i++) {
    //           let obj = {
    //               component_count: '',
    //               template_desc: res[i].software_des,
    //               name: res[i].software_category,
    //               template_name: res[i].software_FC,
    //               component_id: res[i].software_PN,
    //           };
    //           if (res[i].Classify == res[i].type+'-'+ res[i].model) {
    //               //逻辑分区
    //               if (res[i].category_id == 13) {
    //                   obj.component_count = res[i].logicNum;
    //                   //操作系统
    //               } else if (res[i].category_id == 14) {
    //                   obj.component_count = 1;
    //               } else {
    //                   obj.component_count = res[i].cpuActiveNum;
    //               }
    //               arr.push(obj);
    //               continue;
    //           }
    //           //硬件 HPO
    //           if (res[i].Classify == '5313-HPO') {
    //               obj.component_count = 1;
    //               arr.push(obj);
    //               continue;
    //           }
    //           if (res[i].purchase != undefined && res[i].purchase != null
    //               && res[i].purchase != '' && res[i].purchase == 'N/C') {
    //               obj.component_count = 1;
    //           } else{
    //               obj.component_count = res[i].cpuActiveNum;
    //           }
    //           arr.push(obj);
    //       };
    //     this.addirmTable = arr.filter(item => {
    //       if (item.name == 0) {
    //         item.name = '逻辑分区';
    //         return true;
    //       }
    //     });
    //     arr.forEach(item => {
    //       if (item.name == 1) {
    //         item.name = '操作系统';
    //         return this.addirmTable.push(item);
    //       }
    //     });
    //     arr.forEach(item => {
    //       if (item.name == 2) {
    //         item.name = '应用程序';
    //         return this.addirmTable.push(item);
    //       }
    //     });
    //     arr.forEach(item => {
    //       if (item.name == 18) {
    //         item.name = '操作系统SWMA';
    //         return this.addirmTable.push(item);
    //       }
    //     });
    //     arr.forEach(item => {
    //       if (item.name == 19) {
    //         item.name = '逻辑分区SWMA';
    //         return this.addirmTable.push(item);
    //       }
    //     });
    //     arr.forEach(item => {
    //       if (item.name == 20) {
    //         item.name = '应用程序SWMA';
    //         return this.addirmTable.push(item);
    //       }
    //     });
    //     console.log(this.addirmTable);
    //   }
    // });
  },
};
</script>

<style scoped lang="less">
    .affirm {
        header {
            min-height: 50px;
            height: 6%;
            font-size: 16px;
            border-bottom: 1px solid #ccc;

            b {
                margin-left: 20px;
                line-height: 50px;
            }

            .el-button {
                float: right;
                margin-right: 20px;
                margin-top: 10px;
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
        .component-line{
            width: 96%;
            margin:0 2%;
            //margin-right: 20px;
        }
    }
</style>
