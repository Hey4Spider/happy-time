import { Pagination } from '@/utils'
import { reactive } from 'vue'

export const usePagination = (listFunc: () => void) => {
    const pagination = reactive<Pagination>({
        total: 0,
        currentPage: 1,
        pageSize: 100,
        pageSizes: [10, 25, 50, 100],
    })

    const onPageSize = (size: number) => {
        pagination.currentPage = 1
        pagination.pageSize = size
        listFunc()
    }
    const onCurrentPage = (page: number) => {
        pagination.currentPage = page
        listFunc()
    }

    return {
        pagination,
        onPageSize,
        onCurrentPage,
    }
}
