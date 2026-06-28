import { FileTypeImage } from '../definition'

/** 判断是否为基础类型 */
export function isBaseType(value: unknown) {
    return ['string', 'number', 'boolean'].includes(typeof value)
}
/** 判断是否是 Symbol */
export function isSymbol(value: unknown) {
    return typeof value === 'symbol'
}
/** 判断是否为图片 */
export function isImage(mimetype: string) {
    return FileTypeImage[mimetype.toLowerCase()]
}
export function isFunction(val: unknown): val is Function {
    return typeof val === 'function'
}
