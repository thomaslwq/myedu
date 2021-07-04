import instance from './instance'

export function list() {
  return instance({
    url: `/roles`
  })
}

export function info(id) {
  return instance({
    url: `/role/${id}`
  })
}
