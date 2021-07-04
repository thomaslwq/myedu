import instance from './instance'


export function info() {
  return instance({
    url: '/member/detail'
  })
}

export function orders(data) {
  return instance({
    url: '/member/orders',
    data: data
  })
}

export function credit1Records(data) {
  return instance({
    url: '/member/credit1Records',
    data: data
  })
}

export function inviteUsers(data) {
  return instance({
    url: '/member/inviteUsers',
    data: data
  })
}

export function promoCode(data) {
  return instance({
    url: '/member/promoCode',
    data: data
  })
}

export function createPromoCode(data) {
  return instance({
    method: 'POST',
    url: '/member/promoCode',
    data: data
  })
}

export function messages(data) {
  return instance({
    url: '/member/messages',
    data: data
  })
}

export function messageMarkRead(id) {
  return instance({
    url: '/member/notificationMarkAsRead/' + id
  })
}

export function getUserRoles(data) {
  return instance({
    url: '/member/roles',
    data: data
  })
}

export function courses(data) {
  return instance({
    url: '/member/courses',
    data: data
  })
}

export function collectionCourses(data) {
  return instance({
    url: '/member/courses/like',
    data: data
  })
}

export function historyCourses(data) {
  return instance({
    url: '/member/courses/history',
    data: data
  })
}

export function inviteBalanceRecords(data) {
  return instance({
    url: '/member/inviteBalanceRecords',
    data: data
  })
}

export function withdrawRecords(data) {
  return instance({
    url: '/member/withdrawRecords',
    data: data
  })
}

export function createWithdraw(data) {
  return instance({
    method: 'POST',
    url: '/member/withdraw',
    data: data
  })
}