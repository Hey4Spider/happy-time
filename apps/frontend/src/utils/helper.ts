const imageMap = Object.fromEntries(
    ['jpeg', 'jpg', 'png', 'gif', 'webp'].map(item => [item, true]),
)
export function isValidImage(name: string) {
    const subfix = name.split('.').at(-1)?.toLowerCase() || ''
    return imageMap[subfix] || false
}
