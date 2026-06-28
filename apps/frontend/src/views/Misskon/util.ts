import { ResourceStatus } from '@shared'

export const StatusOptions = [
    {
        label: '未下载',
        value: ResourceStatus.Undownload,
    },
    {
        label: '已下载',
        value: ResourceStatus.Downloaded,
    },
    {
        label: '可下载',
        value: ResourceStatus.CanDownload,
    },
    {
        label: '不喜欢',
        value: ResourceStatus.DontLike,
    },
    {
        label: '失败',
        value: ResourceStatus.Failed,
    },
]
