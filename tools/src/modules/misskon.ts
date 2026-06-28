import axios from 'axios'
import { db, logger, newCommand } from '../utils'
import parse from 'node-html-parser'
import { Prisma } from '@node/database'
import { objListToMap, ResourceStatus } from '@shared'

const Axios = axios.create({
    baseURL: 'https://misskon.com',
    proxy: {
        protocol: 'http',
        host: '127.0.0.1',
        port: 7890,
    },
})

export default newCommand('misskon', {
    description: '获取 Misskon 资源',
    action,
})
    .option('-s, --skip', '跳过多少项目', '0')
    .option('-p, --page', '从第几页开始', '1')

async function action({
    skip = 0,
    page = 1,
}: {
    skip?: number
    page?: number
}) {
    skip = Number(skip)
    page = Number(page)

    const [misskon, misskonTag] = await db.$transaction([
        db.misskon.findMany(),
        db.misskonTag.findMany(),
    ])
    const misskonMap = objListToMap(misskon, 'key', true)
    const misskonTagMap = Object.assign(
        {},
        objListToMap(misskonTag, 'name', true),
        objListToMap(misskonTag, 'url', true),
    )

    do {
        logger.info(`正在获取第 ${page} 页`)
        const pageHtml = await getPage(page)
        const pageObj = parse(pageHtml)

        let postList = pageObj.querySelectorAll('.post-listing article')
        if (skip) {
            postList = postList.slice(skip)
        }

        for (const item of postList) {
            const postLinkObj = item.querySelector('.post-box-title a')
            if (!postLinkObj) {
                continue
            }
            const url = postLinkObj.getAttribute('href')!
            const data: Prisma.MisskonCreateInput = {
                key: url.split('/').at(-2)!,
                name: postLinkObj.innerHTML,
                url: url,
                link: '',
                status: ResourceStatus.Undownload,
            }

            logger.info(`${++skip} - 正在获取: ${data.name}`)
            if (misskonMap[data.key]) {
                logger.warn('资源已存在')
                continue
            }

            const postPageHtml = await getPost(data.key)
            const postPageObj = parse(postPageHtml)
            const greenBtnObj = postPageObj.querySelector(
                '.shortc-button.medium.green',
            )
            if (!greenBtnObj) {
                continue
            }

            let postLink = greenBtnObj.getAttribute('href')
            if (!postLink) {
                continue
            } else if (postLink.startsWith('https://ouo.io')) {
                const linkArr = postLink.split('/')
                const code = linkArr.pop()
                linkArr.push('fbc', code!)
                postLink = linkArr.join('/')
            }
            data.link = postLink

            const tagData = {
                create: [] as any[],
                connect: [] as any[],
            } satisfies Prisma.MisskonCreateInput['tags']
            const tags = item
                .querySelectorAll('p.post-meta span.post-cats a')
                .map(tag => ({
                    name: tag.innerHTML,
                    url: tag.getAttribute('href')!,
                }))
            for (const tag of tags) {
                if (!misskonTagMap[tag.name] && !misskonTagMap[tag.url]) {
                    tagData.create.push(tag)
                } else if (misskonTagMap[tag.name]) {
                    tagData.connect.push({ name: tag.name })
                } else if (misskonTagMap[tag.url]) {
                    tagData.connect.push({ url: tag.url })
                }
                misskonTagMap[tag.name] = true
                misskonTagMap[tag.url] = true
            }
            if (tagData.create.length && tagData.connect.length) {
                data.tags = tagData
            } else if (tagData.create.length) {
                data.tags = { create: tagData.create }
            } else if (tagData.connect.length) {
                data.tags = { connect: tagData.connect }
            }
            await db.misskon.create({ data })
        }

        skip = 0
    } while (page++)
}

async function getPage(page: number) {
    const { data } = await Axios.get<string>(`/page/${page}`)
    return data
}

async function getPost(key: string) {
    const { data } = await Axios.get<string>(`/${key}`)
    return data
}
