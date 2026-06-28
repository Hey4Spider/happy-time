/** 构造一个属性为 string 值为类型 T 的键值对对象 */
declare type Recordable<T = any> = Record<string, T>
/** 取数组项的类型 */
declare type ArrayType<T> = T extends (infer U)[] ? U : T
/** 指定类型或者 null */
declare type Nullable<T> = T | null
/** 获取对象的 key 作为联合类型 */
declare type PickKey<T, U extends keyof T> = keyof Pick<T, U>

declare type RequiredKey<T, U extends keyof T> = Omit<T, U> &
    Required<Pick<T, U>>
/** Function Return */
declare type FuncReturn<T extends (...args: any[]) => any> = Awaited<
    ReturnType<T>
>
/** 获取联合类型的部分项目 */
declare type PickUnion<T extends string | number | symbol, K extends T> = K
/** 获取联合类型的部分项目 */
declare type OmitUnion<
    T extends string | number | symbol,
    K extends T,
> = T extends K ? never : T

declare type PickToRequired<T, K extends keyof T> = Omit<T, K> &
    Required<Pick<T, K>>
