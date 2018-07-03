<template>
    <div class="app-wrapper" :class="classObj">
        <!--小分辨率下导航弹出时的蒙层-->
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <!--左侧导航-->
        <sidebar class="sidebar-container"></sidebar>
        <!--页面主体-->
        <div class="main-container">
            <navbar></navbar>
            <app-main></app-main>
        </div>
    </div>
</template>

<script>
    import {Navbar, Sidebar, AppMain} from './components'
    import ResizeMixin from './mixin/ResizeHandler' //屏幕自适应工具

    export default {
        name: 'layout',
        components: {
            Navbar,
            Sidebar,
            AppMain
        },
        mixins: [ResizeMixin], //全局注册一个混入，影响注册之后所有创建的每个 Vue 实例
        computed: {
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            //不同设备分辨率切换样式
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            }
        },
        methods: {
            //关闭左侧导航
            handleClickOutside() {
                this.$store.dispatch('CloseSideBar', {withoutAnimation: false})
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }

    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }
</style>
