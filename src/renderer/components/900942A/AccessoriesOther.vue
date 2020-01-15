<template>
    <!--其他-->
    <div class="other">
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('Accessories.lists.rests.title')}}</span>
            </p>
            <div class="modify for-main">
                <el-select size="mini" v-model="value" placeholder="请选择" disabled="disabled" class="sel">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-select size="mini" v-model="value" placeholder="请选择" class="other-select-two"
                           disabled="disabled">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <p class="icon">*</p>
                <el-select size="mini" v-model="value" placeholder="请选择" disabled="disabled" class="sel">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-button class="icon-close" type="info" size="mini" icon="el-icon-close"
                           circle></el-button>
                <br>
                <el-button size="mini" icon="el-icon-plus" disabled="disabled"></el-button>
                <span class="add-cables">{{$t('Accessories.lists.rests.content1')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 配件 其他
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */
    export default {
        name: "AccessoriesOther",
        data(){
            return{
                input: '',
                options: [],
                value: '',
            }
        },

        methods:{





        }

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
        margin: 40px 0;
    }
</style>
