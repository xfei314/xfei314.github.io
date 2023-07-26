<template>
	<div class="aside">
		<div class="common-apps">常用应用</div>
		<div class="favorites-menu">收藏菜单</div>
	</div>
	<div class="content">
		<div class="header"></div>
		<div class="app-list">
			<div v-for="item in data.appList" :key="item.name" class="app-item">
				<div class="title">{{ item.title }}</div>
				<div v-for="appItem in item.apps" :key="appItem.name">{{ appItem.title }}</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { reactive } from 'vue';

const data = reactive({
	appList: [
		{
			name: 'f1',
			title: '分类1',
			apps: [
				{ name: 'xt1', title: '子产品1', href: '' },
				{ name: 'xt2', title: '子产品2', href: '' },
				{ name: 'xt3', title: '子产品3', href: '' },
			],
		},
		{
			name: 'f2',
			title: '分类2',
			apps: [
				{ name: 'xt21', title: '子产品21', href: '' },
				{ name: 'xt22', title: '子产品22', href: '' },
				{ name: 'xt23', title: '子产品23', href: '' },
			],
		},
	],
});
</script>

<style lang="less">
.aside {
	width: 188px;
}
.content {
}
</style>
