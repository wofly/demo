<template>
    <div class="home-background theme-color1">
        <!--<Header class="header"></Header>-->
        <Aside class="aside"></Aside>
        <Comrou class="comrou"></Comrou>
        <div class="container">
            <router-view class="clearfix"></router-view>
        </div>
    </div>
</template>
<script>
    import Aside from '../components/Aside.vue';
    // import Header from '../components/Header.vue';
    import Comrou from '../components/Comrou.vue';

    export default {
        data() {
            return {};
        },
        components: {
            Aside,
            // Header,
            Comrou,
        },
    };
</script>
<style lang="less">
    @import "../assets/less/global.less";

    .home-background {
        position: relative;
        /*background-color: #fff;*/

        .header {
            position: absolute;
            top: 2px;
            left: @view-left;
            right: 0;
            height: @view-top;
            line-height: @view-top;
            min-width: 1250px;
        }

        .aside {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 19;
        }

        .comrou {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 60px;
            width: @view-left;
            z-index: 17;
        }

        .container {
            position: absolute;
            top: 0;
            right: 0;
            left: 260px;
            bottom: 0;
            overflow: auto;
            min-width: 1000px;
        }
    }
</style>
