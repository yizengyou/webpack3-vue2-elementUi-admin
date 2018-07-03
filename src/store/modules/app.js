import Cookies from 'js-cookie'

const app = {
    state: {
        //侧边栏状态
        sidebar: {
            opened: !+Cookies.get('sidebarStatus'),//字符串变成数字，再布尔值取反
            withoutAnimation: false //是否没有使用动画
        },
        //设备说明
        device: 'desktop' //设备
    },
    mutations: {
        //侧边导航切换状态
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened //取反
            state.sidebar.withoutAnimation = false
        },
        //关闭侧边导航
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        //切换设备
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        }
    },
    actions: {
        //切换导航
        ToggleSideBar: ({commit}) => {
            commit('TOGGLE_SIDEBAR')
        },
        //关闭导航
        CloseSideBar({commit}, {withoutAnimation}) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        //切换设备
        ToggleDevice({commit}, device) {
            commit('TOGGLE_DEVICE', device)
        }
    }
}

export default app
