export enum ResourceType {
    File = 'File',
    Folder = 'Folder',
}

export enum ResourceStatus {
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
