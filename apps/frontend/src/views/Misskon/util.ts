import { ResourceStatus } from '@/utils'
import { TagProps } from 'element-plus'

export const StatusOptions: {
    label: string
    value: ResourceStatus
    type: TagProps['type']
}[] = [
    {
        label: '所有',
        value: ResourceStatus.All,
        type: 'info',
    },
    {
        label: '未下载',
        value: ResourceStatus.Undownload,
        type: 'info',
    },
    {
        label: '已下载',
        value: ResourceStatus.Downloaded,
        type: 'success',
    },
    {
        label: '可下载',
        value: ResourceStatus.CanDownload,
        type: 'info',
    },
    {
        label: '不喜欢',
        value: ResourceStatus.DontLike,
        type: 'warning',
    },
    {
        label: '失败',
        value: ResourceStatus.Failed,
        type: 'danger',
    },
]

export const StatusMap = Object.fromEntries(
    StatusOptions.map(item => [item.value, item]),
) as Record<ResourceStatus, (typeof StatusOptions)[number]>
