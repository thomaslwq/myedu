import instance from './instance'

export function info(videoId) {
    return instance({
        url: `/video/${videoId}`
    })
}

export function comments(videoId) {
    return instance({
        url: `/video/${videoId}/comments`
    })
}

export function createComment(videoId, params) {
    return instance({
        method: 'POST',
        url: `/video/${videoId}/comment`,
        data: params
    })
}

export function playUrl(videoId) {
    return instance({
        url: `/video/${videoId}/playinfo`
    })
}

export function record(videoId, data) {
    return instance({
        method: 'POST',
        url: `/video/${videoId}/record`,
        data: data
    })
}
