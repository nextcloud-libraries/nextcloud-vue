<template>
    <div class="code-example">
        <strong>{{ title }}</strong>
        <div class="code">
            <slot></slot>
        </div>
        <strong>Rendered example</strong>
        <div class="example-render">
        <div>
            <slot name="example"></slot>
            <div ref="dynamicRendering"></div>
        </div>
        </div>
    </div>
</template>
<style>
.example-render {
    border: 1px solid #aaa;
    border-radius: 3px;
    padding: 10px;
}
.code-example {
    margin-top: 20px;
    margin-bottom: 60px;
}
</style>
<script>
import Vue from 'vue'
export default {
    name: 'VueCodeExample',
    props: ['title'],
    mounted() {
        let textContent = this.$slots.default[0].children[0].children[0].elm.textContent;
        const  vm = new Vue({
            template: textContent,
        })
        vm.$mount(this.$refs.dynamicRendering);

    }
}
</script>

