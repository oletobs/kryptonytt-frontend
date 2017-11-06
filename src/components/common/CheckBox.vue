<template>
    <div class="m-checkbox-group" @click="toggle">
        <input
                type="checkbox"
                :checked="value"
        >

        <div>
            <span class="check"></span>
            <span class="box"></span>
        </div>

        <label>
            <slot></slot>
        </label>
    </div>
</template>

<script>
    export default {
        props: {
            'value':{
                type:Boolean,
                default:false
            }
        },

        methods: {
            toggle() {
                this.$emit('input', !this.value)
            }
        },

        computed: {

        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">

</style>