<template>
	<view>
		<view class="header">We成信大</view>
		<view class="info">
			<view class="left">
				<view>We成信大</view>
				<view style="font-size: small;margin-left: 20rpx;">{{changelog[0].version}}</view>
			</view>
			<view style="margin-right: 20rpx;" @click="about = !about">{{about?'更新日志':'关于'}}</view>
		</view>
		
		<view v-if="about" class="detail">
			<view class="card">
				<view class="title">项目参与人员：</view>
				<text class="body">
				小程序主体  ---  计科196 msojocs
				验证码识别服务  ---  成信大助手
				客服运营  ---  电商192菠萝仔\n
				</text>
			</view>
			<view class="card">
				<view class="title">开发相关：</view>
				<text class="body">
				开发博客：https://www.jysafe.cn
				前端技术栈：vue.js
				后端技术栈：Springboot/Mysql/Python
				使用Github Actions实现持续集成（CI）, 前后端、小程序构建部署完全自动化。\n\n
				</text>
			</view>
			<view class="card">
				<view class="title">感谢以下开源项目：</view>
				Github:
				<text class="body">
				NerdJoy/VPNAPI -> [webvpn加密算法]
				jin-yufeng/Parser -> [HTML解析]
				lanthora/classtable-client -> [课程表]
				jindw/xmldom -> [xml解析]
				yeziwen/pythonJOB -> [RSA]
				wx-plugin/image-cropper -> [图像剪切]
				wxp-ui/wxp-ui -> [tab|scroll组件]
				rover95/wxapp-form -> [动态表单]
				dressLz/lz -> [无限级树形菜单]\n\n
				</text>
			</view>
			<view class="card">
			<view class="title">大部分图标来源：</view>
			<text class="body">
			https://www.iconfont.cn/
			</text>
		</view>
		</view>
		<view v-else class="detail">
			<view class="card" v-for="item in changelog" :key="index">
				<view class="title" style="justify-content: space-between;">
					<view>{{item.version}}</view>
					<view style="color: gray;">{{item.date}}</view>
				</view>
				<text class="body">
				{{item.log}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				about: true,
				changelog: [
					{
						version: '2.2.1',
						date: '2021/11/01',
						log: "新增隐私说明"
					},
					{
						version: '2.2.0',
						date: '2021/10/31',
						log: "新增资源下载功能"
					},
					{
						version: '2.1.0',
						date: '2021/10/06',
						log: "注册提示"
					},
					{
						version: '2.0.9',
						date: '2021/10/05',
						log: "分离接口路径中的版本号"
					},
					{
						version: '2.0.8',
						date: '2021/10/05',
						log: "增加用户注册功能\n增加小程序互绑功能"
					},
					{
						version: '2.0.7',
						date: '2021/10/04',
						log: "增加小程序用户绑定学生账号功能"
					},
					{
						version: '2.0.6',
						date: '2021/10/04',
						log: "增加初始登录页面\n头部个人信息显示\n计划页面：注册页面、绑定学校账号页面、忘记密码页面"
					},
					{
						version: '2.0.5',
						date: '2021/10/03',
						log: "使用code授权替换openid\n重构SSO登录逻辑"
					},
					{
						version: '2.0.4',
						date: '2021/10/02',
						log: "重构自动登录模块，逻辑更清晰"
					},
					{
						version: '2.0.3',
						date: '2021/10/01',
						log: "新增后端登录授权功能"
					},
					{
						version: '2.0.2',
						date: '2021/09/27',
						log: "修正左右滑动时标签不跟随的问题\n处理了大部分编译时产生的警告"
					},
					{
						version: '2.0.1',
						date: '2021/09/26',
						log: "修复课表第几周显示错误，首页课程安排显示"
					},
					{
						version: '2.0.0',
						date: '2021/09/20',
						log: "从wxapp移植至uniapp，重构网络请求模块"
					}
				]
			}
		}
	}
</script>

<style>
	page{
		background-color: #eee;
	}
	.header{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200rpx;
	}
	.info{
		display: flex;
		background-color: #fff;
		justify-content: space-between;
		margin: 20rpx;
		padding: 20rpx;
	}
	.info > .left{
		display: flex;
		align-items: center;
		font-weight: bold;
	}
	.detail{
		padding-bottom: 2rem;
	}
	.card{
		background-color: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
		padding: 20rpx;
	}
	.card > .title{
		border-bottom: #eee solid 1px;
		padding: 10rpx;
		display: flex;
	}
	.card > .body{
		padding: 10rpx;
		display: block;
		word-break: break-all;
	}
</style>
