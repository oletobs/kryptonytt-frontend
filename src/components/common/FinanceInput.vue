<template>
    <span>

        <slot v-if="!editable" :value="value"></slot>

        <div v-else class="m-input-group m-input-group-flat finance-input-group">
            <input type="number" :value="value" @paste="paste" @keydown="limit" @input="updateValue" ref="input" placeholder="0">
            <span class="bar"></span>
        </div>

    </span>
</template>

<script>
    export default {
        props: [ 'editable', 'value', 'maxDigits' ],

        methods: {
            updateValue() {
                if(this.$refs.input.value.length <= this.maxDigits) {
                    this.$emit('input', this.$refs.input.value)
                }
            },

            limit(event) {
                if((this.$refs.input.value.length >= this.maxDigits) && (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Backspace' && event.key !== 'Control' && event.key !== 'x' && event.key !== 'c')) {
                    event.preventDefault();
                }
            },

            paste(event) {
                if(event.clipboardData.getData('text').length+this.$refs.input.value.length > this.maxDigits) {
                    event.preventDefault();
                }
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .finance-input-group {
        margin-bottom: -6px !important;
        margin-top: -5px !important;

        input {
            text-align: right;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }
    }
</style>