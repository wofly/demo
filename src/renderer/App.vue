<template>
    <div id="app">
        <router-view style="height: 100%;"></router-view>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less">
    html, body, #app {
        height: 100%;
        background: #f5f5f5;
    }

    body {
        color: #333;
        font-size: 14px;
        min-width: 1366px;
    }

    /*------------------左侧菜单---------------------------------*/
    .ivu-menu-vertical .ivu-menu-item {
        padding: 14px 16px;
    }

    .ivu-icon-clipboard {
        margin-left: 2px;
    }

    /*------------------页码---------------------------------*/
    .ivu-page {
        margin: 15px 20px 0 0;
        float: right;
    }


    /*------------------滚动条---------------------------------*/
    ::-webkit-scrollbar {
        height: 8px;
        width: 8px;
        background: transparent;
        border-radius: 4px
    }

    ::-webkit-scrollbar-button {
        display: none
    }

    ::-webkit-scrollbar-track {
        background-color: transparent
    }

    ::-webkit-scrollbar-track-piece {
        background: transparent
    }

    ::-webkit-scrollbar-thumb {
        width: 8px;
        min-height: 15px;
        background: #c1c1c1;
        border-radius: 4px
    }

    ::-webkit-scrollbar-thumb:active, ::-webkit-scrollbar-thumb:hover {
        background: #7d7d7d
    }

    /*------------------表格中气泡---------------------------------*/

    .table-tooltip {
        width: 100%;

        .ivu-tooltip-rel {
            width: 100%;

            div {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    .el-button--small, .el-button--small.is-round{
        padding:8px 26px !important;
    }
    .el-button--mini, .el-button--small{
        font-size: 14px !important;
    }
    .el-card{
        border: thin solid #d1d1d1 !important;
        background-color: inherit !important;
    }
    .g-common-table {
        margin-top: 2%;
        border-top: 1px solid rgb(231, 231, 231);
        border-bottom: 1px solid rgb(231, 231, 231);
        padding: 8px 0;
    }
    .for-main .el-select{
        width: 400px;
    }
    .el-input__inner{
        height: 44px !important;
        font-size: 14px !important;
    }
    .sel-main{
        font-size: 14px !important;
    }
    .for-main .sel{
        width: 90px !important;
    }
    .sel input{
        text-align: center !important;
    }
    .el-scrollbar{
    }
    .for-main p{
        text-align: center;
        font-size: 26px;
        display: inline-block;
        vertical-align: middle;
        padding: 4px 22px 0px 22px;
    }
    .el-button--mini.is-circle{
        padding: 5px !important;
        background: #c8c8c8 !important;
        border-color: #c8c8c8;
    }
    .el-icon-close:before{
        color: #fff;
    }
    .el-button--mini, .el-button--mini.is-round{
        padding: 8px 8px;
    }
    .content-label{
        padding: 5px 5px 5px 0 !important;
        margin: 10px 0 !important;
        font-size: 16px;
        font-weight: 600;
        background: none !important;
    }
    .content-label:before{
        content: " ";
        width: 4px;
        height: 100px;
        border: 2px solid #409EFF;
        background-color: #409EFF;
        margin-right: 10px;
    }
    .el-table th, .el-table tr{
        background: #f5f5f5;
    }
    .el-slider__button-wrapper{
        z-index: 18;
    }
    .el-table__footer-wrapper tbody td{
      background-color: #f5f5f5;
    }
</style>
