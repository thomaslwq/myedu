import instance from './instance'

export function list(params) {
    return instance({
        url: '/courses',
        data: params
    })
}

export function categories(params) {
    return instance({
        url: '/course_categories',
        data: params
    })
}

export function detail(courseId) {
    return instance({
        url: `/course/${courseId}`
    })
}

export function comments(courseId) {
    return instance({
        url: `/course/${courseId}/comments`
    })
}

export function createComment(courseId, params) {
    return instance({
        method: 'POST',
        url: `/course/${courseId}/comment`,
        data: params
    })
}

export function like(courseId) {
    return instance({
        url: `/course/${courseId}/like`
    })
}