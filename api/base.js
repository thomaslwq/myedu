import instance from "./instance"
export function config(){
	return instance({
		url:"/other/config"
	})
}
export function wxLogin(data){
	return instance({
		method:"POST",
		url:"/wechat/mini/login",
		data
	})
}