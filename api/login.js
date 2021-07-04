import instance from './instance'

export function wxLogin(data) {
  return instance({
    method: 'POST',
    url: '/login/wechatMini',
    data: data
  })
}

export function wxMobileLogin(data) {
  return instance({
    method: 'POST',
    url: '/login/wechatMiniMobile',
    data: data
  })
}