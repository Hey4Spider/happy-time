export enum ResourceType {
    File = 'File',
    Folder = 'Folder',
}

export enum ResourceStatus {
    All = 0,
    Undownload = 1,
    Downloaded,
    CanDownload,
    DontLike,
    Failed,
}

export enum WorkspaceOperation {
    Open = 'Open',
    Trash = 'Trash',
    Clear = 'Clear',
}
