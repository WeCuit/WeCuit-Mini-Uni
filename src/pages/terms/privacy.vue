<template>
	<view>
		<view style="display: flex;justify-content: center;align-items: center;height: 200rpx;">
			《We成信大隐私协议》
		</view>
		<block v-for="item in items" :key="item.name">
			<card :title="item.name" :content="item.value"></card>
		</block>
	</view>
</template>

<script>
	import card from '../../components/card.vue';
	
	export default {
		data() {
			return {
				items: [
					{
						name: '0、协议版本',
						value: '版本更新日期：2021年11月1日\n版本生效日期：2021年11月1日'
					},
					{
						name: '1、开发者所处理的用户个人信息（字段及用途）',
						value: 'getLocation(获取地理位置): 用于校园游览时的定位所需'
					},
					{
						name: '2、小程序中接入的第三方插件信息（名称、提供方、收集的信息和用途）',
						value: 'We成信大未接入第三方插件'
					},
					{
						name: '3、用户权益（用户行使查阅、复制、更正、删除权利的方式及联系方式）',
						value: 'We成信大仅提供基本信息查阅功能，相关变更操作请至成都信息工程大学(www.cuit.edu.cn)官方网站进行操作'
					},
					{
						name: '4、开发者对信息的存储（存储期限）',
						value: '在用户未进行注册时，We成信大服务器不存储任何用户账号相关信息，所有信息均存于本地（用户手机），存储期限由腾讯小程序缓存数据存储策略决定，We成信大无权决定。\n截至当前协议版本发布之日（2021年11月1日），账户注册服务仍处于线上测试阶段；暂不建议用户注册，若用户进行注册且造成不良后果，责任由用户个人承当。'
					},
					{
						name: '5、信息的使用规则，承诺按照隐私指引的用途使用用户个人信息',
						value: 'We成信大承诺按照隐私指引的用途使用用户个人信息'
					},
					{
						name: '6、信息对外提供说明，承诺不会未经用户同意将其信息提供给第三方',
						value: 'We成信大不会未经用户同意将其信息提供给第三方'
					},
					{
						name: '7、开发者联系方式',
						value: 'QQ: 1690127128\n邮箱：1690127128@qq.com'
					}
				]
			}
		},
		components: {
			card
		},
	}
</script>

<style>
	page{
		background-color: #eee;
	}
</style>
