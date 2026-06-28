import { isFunction } from './is'

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

export const randomInt = (max = 1, min = 0) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    if (min >= 0 && max > 0 && max >= min) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    return 0
}

/** 随机字符串 */
export const randomString = (
    len = 8,
    { special = false }: { special?: boolean } = {},
) => {
    const baseChars =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const specialChars = '!@#$%^&*()-=_+[]{};<>?,./'

    const chars = special ? baseChars + specialChars : baseChars
    const cLen = chars.length

    let str = ''
    for (let i = 0; i < len; ++i) {
        str += chars[randomInt(cLen)]
    }
    return str
}
/** 格式化文件大小 */
const SizeList = ['B', 'KB', 'MB', 'GB']
export function prettySize(size: number, sizeIdx = 0) {
    if (size > 1000) {
        return prettySize(size / 1000, sizeIdx + 1)
    } else {
        return size.toFixed(1) + SizeList[sizeIdx]
    }
}

/**
 * 根据指定的键和指定的值 (默认为数组元素), 从 JSON 数组中取出对应的键和值作为映射, 并返回
 *
 * @param list  JSON 数组
 * @param key   JSON 中指定的键
 * @param value [默认: Array[index]] 指定的值, 可传入函数 (类似 Array.map) 处理复杂逻辑
 */
export function objListToMap<
    O extends Record<string, any>,
    K extends keyof O,
    U = O,
>(list: O[], key: K, value?: U | ((item: O) => U)): Record<string, U> {
    if (isFunction(value)) {
        return Object.fromEntries(list.map(item => [item[key], value(item)]))
    } else {
        return Object.fromEntries(list.map(item => [item[key], value ?? item]))
    }
}
