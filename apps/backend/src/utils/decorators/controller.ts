import {
    Multipart,
    MultipartFields,
    MultipartFile,
    MultipartValue,
} from '@fastify/multipart'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FileType } from '@shared'

function _getFile(file: Multipart | Multipart[], type?: FileType) {
    let _file: MultipartFile[] = []
    if (Array.isArray(file)) {
        _file = file as MultipartFile[]
    } else if (file) {
        _file = [file as MultipartFile]
    }
    _file = _file.filter(item => item.type === 'file')
    const _indexMap: Recordable<boolean> = {}
    if (type) {
        _file = _file.filter((item, index) => {
            if (item.mimetype === type) {
                _indexMap[index] = true
                return true
            } else {
                return false
            }
        })
    }
    return {
        _file: _file.map(({ fields, ...item }) => item),
        _indexMap,
    }
}
function _getFilename(
    filename: Multipart | Multipart[],
    _indexMap: Recordable<boolean>,
) {
    let _filename: MultipartValue<string>[]
    if (Array.isArray(filename)) {
        _filename = filename as MultipartValue<string>[]
    } else {
        _filename = [filename as MultipartValue<string>]
    }
    return _filename
        .filter((item, index) => item.type === 'field' && _indexMap[index])
        .map(item => item.value)
}
export const FileBody = createParamDecorator(
    async (type: FileType | undefined, context: ExecutionContext) => {
        const {
            file,
            filename = [],
            ...body
        } = context.switchToHttp().getRequest<{
            body: MultipartFields
        }>().body || {}
        if (!file) {
            return { file: [], filename: [] }
        }

        const { _file, _indexMap } = _getFile(file, type)
        const _filename = _getFilename(filename, _indexMap)
        const data = {
            file: _file,
            filename: _filename,
        }
        for (const key in body) {
            if (Array.isArray(body[key])) {
                data[key] = []
                for (const item of body[key]) {
                    if (item.type === 'file') {
                        continue
                    }
                    data[key].push(item.value)
                }
            } else if (body[key]?.type === 'field') {
                data[key] = body[key].value
            }
        }
        return data
    },
)
