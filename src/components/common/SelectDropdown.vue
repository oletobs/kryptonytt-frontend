<template>
    <div class="m-select-group">
        <div class="m-input-group m-input-group-flat" v-on-clickaway="hideOptions">
            <input type="text" :value="value.text" class="select" :class="{ 'used': (value.value.length > 0 || options) }" readonly @click="toggleOptions" ref="select">
            <span class="bar"></span>
            <label>
                <slot></slot>
            </label>
        </div>
        <div v-if="options" class="options" ref="dropdown">
            <div class="m-list-group m-list-group-small m-list-group-hover">
                <div v-for="option in optionList" class="m-list-group-item" :class="{ 'active-option': isSelected(option) }" @click="selectOption(option)">
                    {{ option.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mixin as clickaway } from 'vue-clickaway';

    export default {
        mixins: [ clickaway ],

        props: {
            value: {
                type: Object,
                default() {
                    return {
                        text: '',
                        value: ''
                    }
                }
            },
            optionList: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                options: false,
            }
        },

        methods: {
            toggleOptions() {
                this.options = !this.options;
                if(this.options == false) this.$refs.select.blur();
            },

            hideOptions() {
                this.options = false;
            },

            selectOption(option) {
                this.$emit('input', option)
            },

            isSelected(option) {
                return this.value.value == option.value;
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .m-select-group {
        position: relative;
        width: 100%;

        &.m-select-group-table {
            margin-bottom: -6px !important;
            margin-top: -5px !important;

            input {
                text-align: right;
            }
        }

        .select {
            cursor: pointer;
        }

        .options {
            z-index: 100;
            position: absolute;
            top: 100%;
            max-height: 15rem;
            width: 100%;
            background-color: $night-blue-medium;
            color: $night-gray;
            box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
            overflow-y: auto;
            padding-top: 2px;

            &::-webkit-scrollbar {
                width: 0.5em;
            }

            &::-webkit-scrollbar-track {
                //-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            }

            &::-webkit-scrollbar-thumb {
                background-color: lighten($night-blue-medium,15);
                outline: 1px solid slategrey;
            }
        }

        .m-list-group.m-list-group-small {
            .m-list-group-item {
                user-select: none;
                cursor: pointer;
                padding: 2px 5px;

                &.active-option {
                    font-weight: 500;
                    color: $night-blue-lighter;
                    border-left: 1px solid $night-blue-lighter;
                    padding-left: 4px;

                    &:hover {
                        color: $white;
                    }
                }
            }
        }
    }

    .select-hint {
        display: inline-block;
        margin-bottom: 2.2rem;
    }
</style>