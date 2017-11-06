<template>
    <div class="toggle-switch">

        <label v-if="label">
            <slot></slot>
        </label>

        <label class="switch">

            <input type="checkbox"
                   @click="toggle"
                   :value="value"
                   :checked="value"
            >

            <span class="slider"></span>

        </label>

    </div>
</template>

<script>
    export default {
        props: {
            'value':{
                type:Boolean,
                default:false
            },
            'label': {
                type: Boolean,
                default: true
            }
        },

        methods: {
            toggle() {
                this.$emit('input', !this.value)
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .toggle-switch {
        display: flex;
        align-items: center;
    }

    .label {
        padding-right: 0.8rem;
        color: #8899a6;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 24px;
    }

    .switch input {display:none;}

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #bbbbbb;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked + .slider {
        //background-color: #1c4c61;
        background-color: $night-blue-lighter;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px $night-blue-lighter;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(28px);
        -ms-transform: translateX(28px);
        transform: translateX(28px);
    }
</style>