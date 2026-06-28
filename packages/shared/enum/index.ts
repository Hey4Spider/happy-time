export enum LogLevel {
    Error = 'error',
    Warn = 'warn',
    Info = 'info',
    Http = 'http',
    Verbose = 'verbose',
    Debug = 'debug',
    Silly = 'silly',
}

export enum OrderFunc {
    Asc = 'asc',
    Desc = 'desc',
}

export enum FileType {
    Image = 'Image',
}

export enum ImageType {
    jpeg = 'jpeg',
    png = 'png',
    gif = 'gif',
    webp = 'webp',
}

export enum DirectionCategory {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
    Column = 'Column',
}

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
