<template>
    <div class="m-multi-select-group" v-on-clickaway="hideOptions">
        <div class="m-input-group m-input-group-flat" @click="toggleOptions">
            <input type="text" :value="values" class="select" :class="{ 'used': (value.length > 0 || options) }" readonly ref="select">
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
                type: Array,
                default() {
                    return [{
                        text: '',
                        value: ''
                    }]
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
                selectedOptions: null
            }
        },

        created() {
            this.selectedOptions = this.value.slice();
        },

        computed: {
            values() {
                if(this.value.length == 1) return this.value[0].text;
                let valuesString = '';
                this.value.forEach((value, index) => {
                    valuesString += value.text;
                    if(index < this.value.length-1) {
                        valuesString += ", ";
                    }
                });
                return valuesString;
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
                let index = this.selectedOptions.findIndex(o => {
                    return o.value == option.value;
                });

                if(index == -1) {
                    this.selectedOptions.push(option);
                } else {
                    this.selectedOptions.splice(index, 1);
                }

                this.$emit('input', this.selectedOptions);
            },

            isSelected(option) {
                let match = this.value.find(value => {
                    if(value.value == option.value) {
                        return true;
                    }
                });

                return match != null;
            },
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .m-multi-select-group {
        position: relative;
        width: 100%;

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