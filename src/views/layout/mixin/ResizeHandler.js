import store from '@/store'

const {body} = document
const WIDTH = 1024
const RATIO = 3

export default {
    watch: {
        //如果在小屏幕中路由发生变化时，左侧导航自动关闭
        $route(route) {
            if (this.device === 'mobile' && this.sidebar.opened) {
                store.dispatch('CloseSideBar', {withoutAnimation: false})
            }
        }
    },
    //在挂载开始之前被调用
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler)
    },
    //组件挂载之后
    mounted() {
        const isMobile = this.isMobile()
        if (isMobile) {
            store.dispatch('ToggleDevice', 'mobile')
            store.dispatch('CloseSideBar', {withoutAnimation: true})
        }
    },
    methods: {
        //判断是否在小屏幕
        isMobile() {
            const rect = body.getBoundingClientRect()
            return rect.width - RATIO < WIDTH
        },
        //屏幕缩放事件
        resizeHandler() {
            if (!document.hidden) {
                const isMobile = this.isMobile()
                store.dispatch('ToggleDevice', isMobile ? 'mobile' : 'desktop')

                if (isMobile) {
                    store.dispatch('CloseSideBar', {withoutAnimation: true})
                }
            }
        }
    }
}
