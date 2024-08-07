import { download, getTmpFile } from '@futurenet/utils';

const regex = {
    username: new RegExp(/^https:\/\/fansly\.com\/(?:live\/)?([^\/]+)/)
}

const normalize = (url) => {
    if (!url) throw new Error('normalized received a null or undefined url.');
    return fromUsername(fansly.regex.username.exec(url).at(1))
}

const fromUsername = (username) => `https://fansly.com/${username}`

const image = async function image (fanslyUserId) {
    if (!fanslyUserId) throw new Error(`first arg passed to fansly.data.image must be a {string} fanslyUserId`);
    const url = `https://api.fansly.com/api/v1/account/${fanslyUserId}/avatar`
    const filePath = getTmpFile('avatar.jpg')
    return download({ filePath, url })
}

const url = {
    normalize,
    fromUsername
}

const data = {
    image
}

const fansly = {
    regex,
    url,
    data,
}

export default fansly