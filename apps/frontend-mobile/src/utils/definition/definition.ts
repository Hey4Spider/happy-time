export type VueProps<T> = T extends abstract new (...args: any) => any
    ? InstanceType<T> extends { $props: infer P }
        ? Omit<Partial<P>, 'ref'>
        : never
    : never
