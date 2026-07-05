const imageMap = Object.fromEntries(
    ['jpeg', 'png', 'gif', 'webp'].map(item => [item, true]),
)
export function isValidImage(name: string) {
    const subfix = name.split('.').at(-1)!
    return imageMap[subfix] || false
}
