// const baseUrl = "https://r1a9yscs-xiaoteng.mock.coding.io";
 // const baseUrl = "https://r1a9yscs-xiaoteng.mock.coding.io";
// const baseUrl = "http://1.116.175.148/api/v2";
 const baseUrl = "https://all.meedu.tech/api/v2";


export default function instance(params){
	return new Promise(function(resolve,reject){
		uni.showLoading();
		uni.request({
			...params,
			url:baseUrl+params.url,
			success: (res) => {
				if(res.statusCode !== 200){
					uni.showToast({
						icon:"none",
						title:"系统错误"
					});
					reject("系统错误");
					return ;
				}
				if(res.data.code === 0){
					resolve(res.data.data);
				}else{
					if(res.data.code === 401){
						if(uni.getStorageSync("access_token")){
							uni.removeStorageSync("access_token");
							un.navigateTo({
								url:"/pages/auth/auth"
							})
						}
					}
					reject(res.data.message);
				}
			},
			fail: (err) => {
				reject(err);
			},
			complete: () => {
				uni.hideLoading();
			}
		})
	})
}