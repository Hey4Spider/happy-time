/** 排序方式 */
export enum OrderFunc {
    Asc = 'asc',
    Desc = 'desc',
}
/** 响应状态 */
export enum ResponseStatus {
    Success = 'Success',
    Failure = 'Failure',
    Children = 'Children',
}
/** 文件类型 */
export enum FileType {
    Image = 'Image',
}
/** 图片类型 */
export enum ImageType {
    jpeg = 'jpeg',
    png = 'png',
    gif = 'gif',
    webp = 'webp',
}
/** 排列类型 */
export enum DirectionCategory {
    /** 水平 */
    Horizontal = 'Horizontal',
    /** 垂直 */
    Vertical = 'Vertical',
    /** 指定列数 */
    Column = 'Column',
}
