import { ElPagination } from 'element-plus'

export type VueProps<T> = T extends abstract new (...args: any) => any
    ? InstanceType<T> extends { $props: infer P }
        ? Omit<Partial<P>, 'ref'>
        : never
    : never

export type Pagination<
    T = Pick<
        InstanceType<typeof ElPagination>['$props'],
        'total' | 'currentPage' | 'pageSize' | 'pageSizes'
    >,
> = {
    -readonly [P in keyof T]: T[P]
}
