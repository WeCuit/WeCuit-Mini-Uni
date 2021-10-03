<template>
	<view>
		<view>
			<uni-row>
				<uni-col offset="5" span="14">
					<uni-title type="h1" align="center" title="登录授权"></uni-title>
				</uni-col>
				
				<uni-col v-if="status === 'wait'">
					<view class="notice">
						<view class="iconfont icon-dengdaishouquan icon" style="color:#158eff"></view>
						<view style="font-size: large;">是否授权本次操作？</view>
						<view style="color:gray">{{authType === 'bind'?'绑定用户：' + displayName:'登录后台'}}</view>
					</view>
					<view class="btn-area">
						<uni-row>
							<uni-col span="16" offset="4"><button type="primary" @click="doAuthAction('accept')">授权</button></uni-col>
						</uni-row>
						<uni-row>
							<uni-col span="16" offset="4">
								<button style="margin-top: 20rpx;" type="default" @click="doAuthAction('reject')">拒绝</button>
							</uni-col>
						</uni-row>
					</view>
				</uni-col>
				<uni-col v-if="status === 'success'">
					<view class="notice">
						<view class="iconfont icon-shouquanchenggong icon" style="color:#55ff00"></view>
						<view style="font-size: large;">授权成功！</view>
						<view style="color:gray">{{authType === 'bind'?'绑定用户：' + displayName:'登录后台'}}</view>
					</view>
					<view class="btn-area">
						<uni-row>
							<uni-col span="16" offset="4">
								<navigator open-type="switchTab" url="/pages/index/index">
									<button style="margin-top: 20rpx;" type="default">返回首页</button>
								</navigator>
							</uni-col>
						</uni-row>
					</view>
				</uni-col>
				<uni-col v-else-if="status === 'failed'">
						<view class="notice">
							<view class="iconfont icon-shouquanbohui icon" style="color:red"></view>
							<view>授权失败：{{reason}}</view>
						</view>
						<view class="btn-area">
							<uni-row>
								<uni-col span="16" offset="4">
									<navigator open-type="switchTab" url="/pages/index/index">
										<button style="margin-top: 20rpx;" type="default">回首页</button>
									</navigator>
								</uni-col>
							</uni-row>
						</view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
	import {getTokenTnfo, postTokenResult} from './api.js'
	const app = getApp()
	
	export default {
		data(){
			return {
				token: '',
				authType: '',
				displayName: '未知用户',
				status: 'wait',
				reason: '未知原因'
			}
		},
		onLoad(query) {
			// scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
			const scene = decodeURIComponent(query.scene)
			console.log(scene)
			this.token = scene
			this.loadTokenInfo(this.token)
		},
		methods:{
			loadTokenInfo(token){
				getTokenTnfo(token).then(res=>{
					const resp = res.data;
					const {data} = resp;
					console.log(data)
					this.authType = data.type;
					if(data.type === 'bind')
						this.displayName = data.displayName
				}).catch(err=>{
					console.log('getAuthInfo err', err)
					const resp = err.data;
					const data = resp.data;
					if(resp.code === 405){
						// token无效
						this.status = 'failed'
						this.reason = 'token无效'
					}
				})
			},
			doAuthAction(action){
				uni.showLoading({
					title:'提交中'
				})
				if(action === 'accept'){
					uni.login({
						success: res => {
							postTokenResult(this.token, res.code)
							.then(res=>{
								
								wx.hideLoading()
								const resp = res.data;
								const {data} = resp;
								if(data.result){
									this.status = 'success'
								}else{
									this.status = 'failed'
									this.reason = '未知原因'
								}
							}).catch(err=>{
								wx.hideLoading()
								const resp = err.data;
								this.status = 'falied'
								if(resp.msg){
									this.reason = resp.msg
								}else{
									this.reason = '未知原因'
								}
							})
						},
						fail: () => {},
						complete: () => {}
					});
				}else{
					postTokenResult(this.token)
					.then(res=>{
						wx.hideLoading()
						const resp = res.data;
						const {data} = resp;
						this.status = 'failed'
						if(data.result){
							this.reason = '主动拒绝'
						}
					}).catch(err=>{
						const resp = err.data;
						this.status = 'failed'
						wx.hideLoading()
						if(resp.msg){
							this.reason = resp.msg
						}else{
							this.reason = '未知原因'
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	.btn-area{
		margin-top: 20rpx;
	}
	.notice{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.icon{
		font-size: 333rpx;
		margin: 20rpx;
	}
</style>
