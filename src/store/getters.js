const getters = {
  sidebar: state => state.app.sidebar, //返回导航状态
  device: state => state.app.device, //返回设备信息
  token: state => state.user.token, //放回token
  avatar: state => state.user.avatar, //返回用户头像
  name: state => state.user.name, //放回用户名
  roles: state => state.user.roles, //返回权限数组
  permission_routers: state => state.permission.routers, //获得最终的路由结果-全部路由配置
  addRouters: state => state.permission.addRouters //获得权限过滤之后的路由结果
}
export default getters
