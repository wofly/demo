<template>
    <div>
        <div class="g-common-table">
            <div class="g-table-top">
                <span class=" g-title-text">{{ $t('details.header.ConvertTools')}}</span>
                <div class="g-table-btn-group ">
                    <el-button size="small" type="primary" @click="reload">{{$t('productSelect.button')}}</el-button>
                </div>
            </div>
        </div>

        <iframe width="100%" height="950px" src="http://172.31.2.182:8090/view.html" frameborder="0"></iframe>
    </div>
</template>
<script>

    export default {
        data() {
            return {
            };
        },
        components: {

        },
        methods: {
            reload() {
                this.$router.push({path:'/Projectpar',query:{}});
            },

        },
        created(){

        }

    };
</script>
<style lang="less">
    .g-title-text {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #666666;
        font-size: 16px;
        font-weight: 700;
        position: relative;
        padding-left: 30px;
    }
    .g-table-btn-group {
        float: right;
        padding-right: 32px;
        margin-top: 4px;
    }
</style>
