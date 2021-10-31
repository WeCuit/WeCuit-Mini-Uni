<template>
	<view>
		<view class="list">
			<view v-if="parent.length > 0" @tap="backToParent" class="top">
				<view class="iconfont icon-wenjianjia" style="margin: 10rpx;"></view>
				...
			</view>
			<block v-for="(item, index) in current" :key="index">
				<view v-if="item.type == 'directory'" :data-index="index" @tap="openDir" class="dir">
					<view class="iconfont icon-wenjianjia" style="margin: 10rpx;"></view>
					<view class="name" style="margin: 10rpx;">{{item.name}}</view>
				</view>
				<view v-else class="file">
					<view class="info">
						<view class="iconfont icon-wenjian" style="margin: 10rpx;"></view>
						<view class="detail">
							<view class="name">{{item.name}}</view>
							<view style="font-size: small; color: gray;">大小:{{byte2Str(item.size)}}</view>
						</view>
					</view>
					<view class="download" :data-filename="item.name" @tap="downloadFile">下载</view>
				</view>
			</block>
		</view>
		<view class="thanks" >
			<text v-if="saveDir.length>0" :user-select="true">
				文件保存在：\n{{saveDir}}\n
			</text>
			<text :user-select="true" @click="copyRepo">
				\n数据来源：\n{{repo}}
			</text>
		</view>
		
		<view v-if="!isADClose" style="margin-top:4rem">
		  <ad unit-id="a787d6d9637a2c0c6c69d927e301c9d2" type="card"></ad>
		</view>
		<view v-if="downloading" class="downFrame">
			<view class="main">
				<view class="title">正在下载</view>
				<view style="text-align: center;">{{progressText}}</view>
				<view style="text-align: center;">{{progress}}%</view>
				<button type="primary" @click="downCancle">取消</button>
			</view>
		</view>
		<!-- 回首页按钮悬浮按钮 -->
		<view v-if="fromShare">
			<navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn" style="bottom: 5%;font-size: x-large;"><view class="iconfont icon-shouye"></view></navigator>
		</view>
	</view>
</template>

<script>
	import API from './api.js';
	import log from '../../utils/log.js';
	import { calByte2Size } from '../../utils/tool.js'
	const app = getApp();
	
	export default {
		data() {
			return {
				list: [],
				parent: [],
				dir: [],
				downloadPre: 'https://github.jysafe.cn/cuit_sharing/main/',
				current: null,
				downloading: false,
				progress: 0,
				progressText: "",
				downLoadTask: null,
				baseDir: `${wx.env.USER_DATA_PATH}/cuit_resources`,
				repo: 'https://github.com/andream7/cuit_sharing',
				saveDir: '',
				isADClose: false
			}
		},
		props: {},
		onLoad: function(options){
			this.isADClose = app.globalData.isADClose;
			const fs = uni.getFileSystemManager();
			try{
				fs.renameSync(`${wx.env.USER_DATA_PATH}/123`, `${wx.env.USER_DATA_PATH}/456`)
			}catch(e){
				//TODO handle the exception
				let exp = e.message.match(/'(.*?)\/123'/)
				if(exp && exp.length == 2){
					this.saveDir = exp[1]
				}
			}
		},
		onReady: function (){
			this.loadResource()
			uni.showShareMenu({
			  withShareTicket: true,
			  // for wx
			  menus: ['shareAppMessage', 'shareTimeline'],
			  // for qq
			  showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
			});
		},
		onShow: function (){
				// #ifdef MP-QQ
				this.fromShare = 1 === getCurrentPages().length
				// #endif
		},
		/**
		 * 分享至微信朋友圈
		 */
		onShareTimeline: function (e) {
			return {
				title: '资料下载',
				query: ''
			};
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {
			return {
				title: '资料下载',
				// for wechat
				path: '/pages/resources/list',
				// for qq
				query: ''
			};
		},
		methods: {
			loadResource: function() {
				API.getResource().then(res=>{
					this.list = res.data
					this.parent = [];
					this.current = this.list
				})
			},
			backToParent: function () {
				this.current = this.parent[this.parent.length - 1]
				this.parent.pop()
				this.dir.pop()
			},
			openDir: function(e){
				const index = e.currentTarget.dataset.index;
				this.parent.push(this.current)
				this.dir.push(this.current[index].name)
				this.current = this.current[index].list
			},
			byte2Str(size) {
				return calByte2Size(size)
			},
			isImage(name){
				return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png')
			},
			downloadFile(e){
				const filename = e.currentTarget.dataset.filename;
				const fileDir = this.dir.join('/')
				let filepath = fileDir + '/' + filename;
				const fs = uni.getFileSystemManager();
				
				// 检测文件是否已存在
				try{
					const fileLoc = `${this.baseDir}/${filepath}`;
					fs.accessSync(fileLoc)
					// 已存在
					uni.showModal({
						title: '文件已存在',
						content: '是否直接打开？',
						cancelText: '重下',
						confirmText: '打开',
						success: res=>{
							if(res.confirm){
								// 打开文件
								this.openDownloadFile(fileLoc)
							}else if(res.cancel){
								// 重新下载
								this._downloadFile(fileDir, filename)
							}
						}
					})
				}catch(e){
                    // 文件不存在，下载
					this._downloadFile(fileDir, filename)
				}
			},
			_downloadFile(fileDir, filename){
				this.downloading = true
				let downLink = this.downloadPre + fileDir + '/' + filename;
				
				if(this.downLoadTask != null)this.downLoadTask.abort();
				this.downLoadTask = uni.downloadFile({
					url: downLink,
					timeout: 600 * 1000,
					success: res=>{
						this.progress = 100;
						const fs = uni.getFileSystemManager();
						uni.showModal({
							title: '下载完成',
							content: '打开或者保存并打开？',
							cancelText: '打开',
							confirmText: '一起',
							success: select=>{
								if(select.confirm){
									this.saveDownloadFile(res, fileDir, filename)
								}else if(select.cancel){
									this.openDownloadFile(res.tempFilePath)
								}
							}
						})
					},
					fail: err=>{
						log.error(err)
					},
					complete: err=>{
						this.downloading = false
					}
				})
				this.downLoadTask.onProgressUpdate(res=>{
					this.progress = res.progress
					this.progressText = calByte2Size(res.totalBytesWritten) + "/" + calByte2Size(res.totalBytesExpectedToWrite)
				})
			},
			
			saveDownloadFile(tmpInfo, fileDir, filename){
				const fs = uni.getFileSystemManager();
				fileDir = `${this.baseDir}/${fileDir}`
				const fileLoc = `${fileDir}/${filename}`
				// 文件夹不存在就创建
				try {
				    fs.accessSync(fileDir)
				} catch(e) {
					fs.mkdir({
					  dirPath: fileDir,
					  recursive: true,
					  fail(res) {
					    log.error("文件夹创建失败：", res)
                        return;
					  }
					})
				}
				try{
					fs.saveFileSync(tmpInfo.tempFilePath, fileLoc)
					this.openDownloadFile(fileLoc)
				}catch(e){
					//TODO handle the exception
					log.error("文件保存失败：", e)
				}
				
			},
			
			openDownloadFile(filepath){
				if(this.isImage(filepath)){
					uni.previewImage({
						urls:[filepath]
					})
				}else{
					uni.openDocument({
						filePath: filepath,
						success: res=>{
						},
						fail: err=>{
							log.error("打开文件失败：", filepath, err)
							if(err.errMsg && err.errMsg.indexOf('filetype not supported') != -1){
								uni.showToast({
									title: '不支持的格式',
									icon: 'none'
								});
							}
						}
					})
				}
			},
			downCancle(){
				this.downloading = false;
				if(this.downLoadTask != null){
					this.downLoadTask.abort()
					this.downLoadTask = null
				}
			},
			copyRepo(){
				uni.showModal({
					title: '复制链接',
					content: '复制项目链接\n' + this.repo,
					showCancel: true,
					cancelText: '取消',
					confirmText: '复制',
					success: res => {
						if(res.confirm){
							uni.setClipboardData({
								data: this.repo 
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		},
	}
</script>

<style>
	page {
	  background: #eee;
	}
	.list{
		padding: 30rpx;
		background-color: #eee;
	}
	.list > view{
		margin: 10rpx;
		padding: 10rpx;
		border-radius: 10rpx;
		background-color: #fff;
	}
	.list .detail{
		white-space:nowrap;
		overflow:auto;
		margin-right: 20rpx;
	}
	.list > .file{
		justify-content: space-between;
		align-items: center;
	}
	.list > .file > .info, .list > view{
		display: flex;
		min-width: 0;
	}
	.list > .file > .download{
		margin-right: 10rpx;
		background-color: #03a9f4;
		border-radius: 10rpx;
		padding: 10rpx;
		white-space: nowrap;
	}
	.thanks{
		padding: 50rpx;
		word-break:break-all;
	}
	.downFrame{
		position: fixed;
		top:0;
		width: 100vw;
		height: 100vh;
		background-color: #00000090;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.downFrame > .main{
		padding: 40rpx;
		background-color: white;
		height: 300rpx;
		width: 500rpx;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.downFrame>.main > .title{
		text-align: center;
	}
	@font-face {
	  font-family: "iconfont"; /* Project id 2904361 */
	  src: 
	       url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAANIAAsAAAAAB1AAAAL7AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDBgqCIIIDATYCJAMMCwgABCAFhGcHPhtnBsgusG3YkwAKqQhlM3GNMxjeHMXDf/vR7pt583cxsyZ6upg2lSiWIkQ8lA0RGo2t5P9/a+0j5gPXEPV0mpCV2fWTuTltQMIbmWrZLGm6ROORIEISTyxAzrwYNc9ngHCf55p6CXQ4/jYAybaoxsQDOx/Qga3Lop8PeG8+IJ+CeDYDnfn3MQIjrdctfO/wpBmSbzHUDvkiBcKgro5bsshArB6SEtlBoWPnpvioUV6VIXzIPx//bIxBilYFm+y7MsTDxQ/nRLzoo/6WCgQcVtBQsRpI4sx86pgIMcZFGGmIRHEnhXJo9L8nV7im7pH/eIXoBJWjwXLYig+ljKUEw+SQoJq6DZkDwFWwk688Qs0c17raMqd07WpSjL6YaMxF6NY9avvRZCNzXIy6lzR5W/Ld5JZ1ONxjTTgd37ZNc1I68Xs+TjyysR0/8vV3yBc/Eia8+RXWXv4MJhxOMb7EyUD4knq6cqrszlBp6Hlb9TWGytFt2GV7Oj5qWzv6sZgLE75eXH8ZfODfm59bKL9QMTpkaS5drvvAJGgrn/7WTa2H0kP5lvxHQSJi9kUNmztDg8/jL6C/czC14TV+OAfQXxfrPNCroVr3///GlkOX5rMpW/8Pjkrwp8+xeaCXwHnA4BtzBf+28RTJm26YmmOKeIhAtVHc16g10kj0Bb6JHrabJtGVhEGTahQDZqEatJBMdiWaUTaiM2gbRlplaPEokzhFiByBpRYEwnhbKMb6gmq8KzLZezRTPaMz3i9GOhJj1htlaVwcIJihmEdsAMmcwy5EZpqLNWLRozFkKG7FxC0jiuqqa7vZEWzHZI8Jbq9YT6mABOLQ0bB6GNY0B3ISh4I5Wi1R6myvqRHGHlLNOXQYQGAMCuMhrABExnGwE1J+2v4+I0zkoWEQkrSmCDcZ4pE61WoJcsRgp1o+yCZuXqJ6FCVABERkdMiw7sA0J+WAOMd7KTAOVU3akHBqVxPyCayh+nqT/ue2wUjB4holaqSB+9iuyIw9PpfFdgAA') format('woff2');
	}
	
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.icon-wenjian:before {
	  content: "\e69c";
	}
	
	.icon-wenjianjia:before {
	  content: "\ec17";
	}
	

</style>
