<template>
    <!--线缆-->
    <div class="config cable">
        <p class="title content-label">
            <span class="config-title">{{$t('Accessories.lists.Cable.title')}}</span>
        </p>
        <div class="modify for-main" v-for="(it,ind) in cableChild">
            <el-select size="mini" v-model="it.component_id" placeholder="请选择"  @visible-change="setModel($event,ind)">
                <el-option v-for="(item,index) in it.ather"
                           :key="index"
                           :label="$store.state.info_language?item.description_en:item.description"
                           :value="item.other_id"
                           :disabled="item.bool">
                </el-option>
            </el-select>
            <p class="icon">*</p>
            <el-select size="mini" v-model="it.component_count" placeholder="请选择" class="sel"
                       @change="getNum(ind,it.component_count)" @visible-change="setNum($event,ind)">
                <el-option v-for="(item,index) in it.numZ" :key="index" :label="item"
                           :value="item">
                </el-option>
            </el-select>
            <el-button class="icon-close" size="mini" type="info" icon="el-icon-close" circle v-show="it.bool" @click="deleteModel(ind)">
            </el-button>
            <div v-for="dl in it.ather" v-if="it.component_id==dl.other_id" :key="dl.id">
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
        <el-button size="mini" icon="el-icon-plus" :disabled="cableChild.length>0?true:false" @click="addModel(0)"></el-button>
        <span class="add-cables">{{$t('Accessories.lists.Cable.content1')}}</span>
    </div>
</template>

<script>
    /**
     * 配件 线缆
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */

    export default {
        name: "AccessoriesCable",
        props:['cableChild','brr','id'],
        data(){
            return{
                // 获取电源配置基础信息
                powerData: '',
                // 线缆
                powerValue: '',
                // Power 下拉数据
                powerList: [],
                input:'',
            }
        },

        methods:{
            //点击数量时要展示的数量
            setNum(bool,index){
                if(this.cableChild[index].component_id==3){
                    this.cableChild[index].numZ=50
                }else{
                    this.cableChild[index].numZ=[]
                    for(let i=0;i<=50;i++){
                        if(i>=this.cableChild[index].num){
                            this.cableChild[index].numZ.push(i)
                        }
                    }
                }
            },
            //点击类型时要展示的线缆类型
            setModel(bool,index){
                if(bool){
                    console.log(this.cableChild[index],index,this.brr)
                    this.cableChild[index].ather=this.cableChild[index].arr.filter(item=>{
                        let bool= true
                        for(let i=0;i<this.brr.length;i++){
                            if(item.other_id==this.brr[i] && index !==i){
                                return false
                            }
                        }
                        return bool
                    })
                    if(this.cableChild[index].ather.length>1){
                        this.cableChild[index].ather.forEach((item,ind)=>{
                           if(ind>=1){
                               this.cableChild[index].ather[ind].bool=true
                           }else{
                               this.cableChild[index].ather[ind].bool=false
                           }
                        })
                    }
                }
            },
            /*更改数量*/
            getNum(index,num){
                console.log(this.cableChild[index])
                let updateNum = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${this.cableChild[index].id} `;
                this.$db.run(updateNum, (err, res) => {
                    console.log(res, err);
                    if (res) {
                        console.log('修改失败');
                    } else {
                        console.log('修改成功');
                    }
                })
            },
            /*删除数据*/
            deleteModel(index){
                const deleteSQL = `DELETE FROM product_programme_detail WHERE id = ${this.cableChild[index].id}`;
                this.$logger(deleteSQL);
                this.$db.run(deleteSQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$db.run('ROLLBACK');
                        this.$Notice.error({
                            title: '删除失败',
                            desc: err,
                        });
                    }else{
                        this.cableChild.splice(index,1)
                        this.brr.splice(index,1)
                        console.log('删除成功')
                    }
                });
            },
            /*添加线缆*/
            addModel(index) {
                let arr = this.cableChild[0].arr.filter(item => {
                    let bool = true
                    for (let i = 0; i < this.brr.length; i++) {
                        if (this.brr[i] == item.other_id) {
                            return bool = false
                        }
                    }
                    return bool
                })
                console.log(this.id,this.$route.query.signT,arr)
                const time = new Date().getTime();
                const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.signT}','${arr[0].other_id}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}','1')`;
                this.$db.run(updateSql, (err, res) => {
                    if (err) {
                        console.log('添加失败');
                    } else {
                        console.log('添加成功');
                        const selectSql = `select * from product_programme_detail where seq_Key=${time}`;
                        this.$db.get(selectSql, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '系统错误',
                                    desc: err,
                                });
                            } else {
                                console.log(res)
                                let item = this.cableChild[0]
                                this.cableChild.push({
                                    ...item.arr[1],
                                    arr:item.arr,
                                    ather:[{ ...item.arr[1]}],
                                     component_count:res.component_count,
                                     component_id:res.component_id,
                                     id:res.id,
                                     numZ:0,
                                    bool:true,
                                    num:1
                                })
                                console.log(this.cableChild[1],index)
                                if(index){
                                    this.cableChild[this.cableChild.length-1].bool=false
                                }
                            }
                        })
                    }
                })
            }
        },
    }
</script>

<style scoped lang="scss">

    /*----------------------表单项--------------------------*/

    .config {
        margin-top: 20px;
        margin-left: 20px;

        .icon {
            font-size: 25px;
            text-align: center;
            height: 50px;
            display: inline-block;
        }

        .el-input {
            width: 80px;
            margin-right: 20px;
        }

        .el-select {
            width: 400px;
        }


        .title {
            width: 98%;
            background: #f2f2f2;
            padding: 5px;
            margin-bottom: 10px;
        }
        .add-cables {
            padding: 10px;
        }
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }
    .cable {
        margin-top: 20px;
    }

    .modify {
        margin: 20px 0;
    }

    .icon-close {
        margin-left: 12px;
        font-size: 8px;
        background: #C8C8C8;
        border: none;
    }

    .add-cables {
        padding: 10px;
    }
</style>
