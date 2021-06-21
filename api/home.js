import instance from './instance'

export function indexBanners(params) {
  return instance({
      url: '/index/banners',
      data: params
  })
}

export function sliders() {
  return instance({
      url: '/sliders',
      data: {
        platform: 'mini'
      }
  })
}

export function search(params) {
  return instance({
      url: '/search',
      data: params
  })
}