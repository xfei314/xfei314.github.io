<template>
	<component v-if="loading" :delay="delay" :is="loadingComponent" />
	<component v-else-if="error" :is="errorComponent" />
	<component v-else-if="comp" :is="comp" v-bind="attrs">
		{{ slots.default ? slots.default() : null }}
	</component>
</template>
<script setup>
import { watch, ref, useAttrs, useSlots, nextTick } from 'vue';
import {isFunction} from "lodash-es";
import {debounce} from "lodash-es";
import Error from './Error.vue';
import { Loading } from 'xdp';
// import { sleep } from "@/utils";
const props = defineProps({
	// 组件类型， 组件名称，动态组件方法
	is: {
		type: [String, Object, Function],
		default: undefined,
	},
	// 加载异步组件时使用的组件
	loadingComponent: {
		type: Object,
		default: Loading,
	},
	// 加载失败时使用的组件
	errorComponent: {
		type: Object,
		default: Error,
	},
	// 在显示加载组件之前延迟。默认值：200ms。
	delay: {
		type: Number,
		default: 200,
	},
	// 超过给定时间，则会显示错误组件。默认值：Infinity。
	timeout: {
		type: Number,
		default: 3000,
	},
});
const slots = useSlots();
const attrs = useAttrs();
const comp = ref(null);
const loading = ref(false);
const error = ref(false);

const setComponent = debounce(async function () {
	const is = props.is;
	if (isFunction(is)) {
		error.value = false;
		loading.value = true;
		comp.value = null;
		await nextTick();
		try {
			const curComp = await is();
			comp.value = curComp.default;
		} catch (error) {
			error.value = true;
		} finally {
			loading.value = false;
		}
	} else {
		error.value = false;
		loading.value = false;
		comp.value = is;
	}
}, 10);
watch(
	() => props.is,
	() => {
		setComponent();
	},
	{ immediate: true }
);
</script>
