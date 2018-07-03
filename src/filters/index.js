/*
* 注册全局过滤器
* */
export {parseTime} from '@/utils'

//数字千分位格式化
export function toThousandslsFilter(num) {
    return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
