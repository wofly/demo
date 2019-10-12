<template>
    <!--方案详情-->
    <div id="box">
        <div class="header-pr1">
            <div class="hdr-main">
                <p class="listp">{{ $t('details.lists.scenarioName')}}</p>
                <div class="pr1-list">
                    <ul>
                        <li @click="addSolution" class="edit" @mouseenter="editImage(1)" @mouseleave="editImages(1)">
                            <img v-show="editPictureSwitching" src="../../assets/object/edit2.png"/>
                            <img v-show="!editPictureSwitching" src="../../assets/object/edit.png"/>
                            <span>{{ $t('details.header.EditPackages')}}</span>
                        </li>
                        <li @click="addMachien"  class="edit"  @mouseenter="editImage(2)" @mouseleave="editImages(2)">
                            <img v-show="addPictureSwitching" src="../../assets/object/add2.png"/>
                            <img v-show="!addPictureSwitching" src="../../assets/object/add.png"/>
                            <span>{{ $t('details.header.AddTheMachine')}}</span>

                        </li>
                        <li  class="edit"   @mouseenter="editImage(3)" @mouseleave="editImages(3)">
                            <img v-show="checkPictureSwitching" src="../../assets/object/check2.png"/>
                            <img v-show="!checkPictureSwitching" src="../../assets/object/check.png"/>
                            <span>{{ $t('details.header.TheOverallValidation')}}</span>

                        </li>
                        <li  class="edit"  @mouseenter="editImage(4)" @mouseleave="editImages(4)">
                            <img v-show="leadingPictureSwitching" src="../../assets/object/leading2.png"/>
                            <img v-show="!leadingPictureSwitching" src="../../assets/object/leading.png"/>
                            <span>{{ $t('details.header.ImportMachine')}}</span>
                            <input class="importfile" @change="upload($event,callback)" type="file" />
                        </li>
                        <li  class="edit"  @click="buttonStart('cfr')"  @mouseenter="editImage(5)" @mouseleave="editImages(5)">
                            <img  v-show="leadingOutPictureSwitching" src="../../assets/object/leading-out2.png"/>
                            <img  v-show="!leadingOutPictureSwitching" src="../../assets/object/leading-out.png"/>
                            <span>{{ $t('details.header.ExportPlan')}}</span>
                        </li>
<!--                        <li  class="excel"  @click="buttonStart('xlsx')"  @mouseenter="editImage(5)" @mouseleave="editImages(5)">-->
<!--                            <img  v-show="leadingOutPictureSwitching" src="../../assets/object/leading-out2.png"/>-->
<!--                            <img  v-show="!leadingOutPictureSwitching" src="../../assets/object/leading-out.png"/>-->
<!--                            <span>导出EXCEL</span>-->
<!--                        </li>-->
<!--                        <li @click="buttonStart('csv')"><img src="../../assets/object/leading-out2.png"/><span>导出CSV</span></li>-->
<!--                        <li @click="buttonStart('excel')"><img src="../../assets/object/leading-out2.png"/><span>导出EXCEL</span></li>-->
                    </ul>
                </div>
            </div>
        </div>
        <div class="probody">
            <div class="header-pr2">
                <p class="tit-style listp" id="proInt">{{ $t('details.lists.ProjectIntroduction')}}</p>
            </div>
            <Detailhedr></Detailhedr>
            <div class="header-pr2">
                <p class="tit-style listp" id="proDes">{{ $t('details.lists.ProgramOverview')}}</p>
            </div>
          <Detailscheme></Detailscheme>
            <div class="header-pr2">
                <p class="tit-style listp" id="priSta">{{ $t('details.lists.PriceStatistics')}}</p>
            </div>
          <DetailList></DetailList>

          <div class="header-pr2">
            <p class="tit-style listp" id="priSta">{{ $t('details.lists.machineConfiguration')}}</p>
          </div>
            <DetailMain></DetailMain>
        </div>
    </div>
</template>

<script>
// 拆分引入数据模块
import Detailhedr from '@/components/Detailhedr.vue';
import Detailscheme from '@/components/Detailscheme';
import DetailList from '@/components/DetailList';
import DetailMain from '@/components/DetailMain';
import exportCfrOrCsv from "../../utils/exportCfrOrCsv";
export default {
  name: 'Projectpar',
  components: {
    Detailhedr,
    Detailscheme,
    DetailList,
    DetailMain,
  },
  data() {
    return {
      Projump: '',
        // 编辑方案切换图片
        editPictureSwitching:true,
        // 添加机器切换图片
        addPictureSwitching:true,
        // 整体验证切换图片
        checkPictureSwitching:true,
        // 导入机器切换图片
        leadingPictureSwitching:true,
        // 导出方案切换图片
        leadingOutPictureSwitching:true,
    };
  },
  mounted() {
  },
  methods: {
      /*鼠标移入切换图片*/
      editImage(index){
          switch (index) {
              case 1:
                  // 编辑方案切换图片
                  this.editPictureSwitching = false;
                break;
              case 2:
                  // 添加机器切换图片
                  this.addPictureSwitching = false;
                  break;
              case 3:
                  // 整体验证切换图片
                  this.checkPictureSwitching = false;
                  break;
              case 4:
                  // 导入机器切换图片
                  this.leadingPictureSwitching = false;
                  break;
              case 5:
                  // 导出方案切换图片
                  this.leadingOutPictureSwitching = false;
                  break;
          }
      },

      /*鼠标移出切换图片*/
      editImages(index){
          switch (index) {
              case 1:
                  // 编辑方案切换图片
                  this.editPictureSwitching = true;
                  break;
              case 2:
                  // 添加机器切换图片
                  this.addPictureSwitching = true;
                  break;
              case 3:
                  // 整体验证切换图片
                  this.checkPictureSwitching = true;
                  break;
              case 4:
                  // 导入机器切换图片
                  this.leadingPictureSwitching = true;
                  break;
              case 5:
                  // 导出方案切换图片
                  this.leadingOutPictureSwitching = true;
                  break;
          }
      },

    /* 获取ID锚点跳转*/
    getlocal() {
      const select = this.$store.state.ProAnchor; // 获取vuex数据
      const anchorElement = document.getElementById(select); // 获取指定标签
      if (select) {
        anchorElement.scrollIntoView(); // 方法跳转
      }
      this.Projump = select;
    },
    /* 添加方案*/
    addSolution() {
      this.$router.push({ // 核心语句
        path: '/ProgrammeAdd', // 跳转的路径
        query: { // 路由传参时push和query搭配使用 ，作用时传递参数
          id: 1,
        },
      });
    },
    /* 添加机器*/
    addMachien() {
      this.$router.push({ // 核心语句
        path: '/ProductSelection', // 跳转的路径
        query: { // 路由传参时push和query搭配使用 ，作用时传递参数
          // id:this.id ,
        },
      });
    },
    buttonStart(tailName) {
        //获取配置完成的机器列表
        const machineSQL = `SELECT * FROM machine_info WHERE status = 1 AND product_id = 1 AND solution_id = ${localStorage.solutionId}`;
        this.$db.all(machineSQL, (err, res) => {
            if (err) {
                this.$logger(err);
                this.$Notice.error({
                    title: '搜索失败',
                    desc: err,
                });
            } else {
                for (let i = 0; i < res.length; i++) {
                    this.exportCfr(res[i].remark_name,tailName,res[i].solution_id,res[i].templete_id,res[i].id);
                }
            }
        });
    },
    exportCfr(machineName,tailName,solutionId,templateId,machineId) {
          exportCfrOrCsv.exportCfrOrCsv(machineName,tailName,solutionId,templateId,machineId);
    },
      //导入機器
      upload(event,callback) {
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.onload = function() {
              callback(this.result);
          }
          reader.readAsText(file);
      },
      callback(result){
          console.log(result);
      }
  },

  /* 监听vuex数据变化触发锚点方法 */
  watch: {
    '$store.state.ProAnchor': 'getlocal',
  },
};
</script>
<style scoped lang="scss">
    #app {
        color: #2c3e50;
    }

    * {
        padding: 0;
        margin: 0;
        list-style: none;
        box-sizing: border-box;
    }
    .listp{
      font-weight: bolder;
    }
    .box {
        min-width: 700px;
        width: 100%;
        height: 100%;
    }

    .probody {
        width: 100%;
    }

    .header-pr2 {
        width: 100%;
        padding: 20px;
    }

    .tit-style {
        width: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebebeb;
    }

    .header-pr1 {
        width: 100%;
        padding: 20px;

        .hdr-main {
            width: 100%;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ebebeb;
        }

        .pr1-list ul {
            display: flex;

            li {
                cursor: pointer;
                padding: 12px;
                margin-left: 9px;
                text-align: center;
                /*border: 1px solid #333333;*/
                span {
                    display: block;
                }
            }
        }
    }
    .edit{
        position: relative;
    }
    .importfile{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 99999;
    }

    .edit:hover{
        color: rgb(42,115,204);
    }
    
</style>
