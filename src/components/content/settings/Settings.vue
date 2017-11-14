<template>
    <div class="settings">
        <h2>Settings</h2>

        <div class="row currency-settings">
            <div class="col-xl-8">
                <select-dropdown v-model="defaultCurrency" :option-list="defaultCurrencyOptions">Default Currency</select-dropdown>
                <small class="select-hint">The primary currency. Used to display the latest prices and also used in most charts.</small>

                <multi-select-dropdown v-model="currencies" :option-list="additionalCurrenciesOptions">Additional Currencies</multi-select-dropdown>
                <small class="select-hint">Portfolio values and asset values will also be shown in these currencies.</small>

                <button class="m-button m-button-block" @click="saveSettings" :disabled="loading" v-if="loggedIn">
                    <beating-heart v-if="loading"></beating-heart>
                    <template v-else>Save Settings</template>
                </button>
            </div>
        </div>

    </div>
</template>

<script>
    import { EventBus } from '../../../EventBus'
    import SelectDropdown from '../../common/SelectDropdown.vue'
    import MultiSelectDropdown from '../../common/MultiSelectDropdown.vue'
    import BeatingHeart from '../../common/BeatingHeart.vue'

    export default {
        data() {
            return {
                loading: false
            }
        },

        computed: {
            loggedIn() {
                return this.$store.state.loggedIn;
            },

            allCurrencyOptions() {
                let allCurrencies = this.$store.getters.allCurrencies.map(currency => {
                    return { value: currency, text: currency }
                });
                console.log("all");
                return allCurrencies;
            },

            defaultCurrencyOptions() {
                console.log("default");
                return this.allCurrencyOptions.filter((currency)=> {
                    return (this.currencies.findIndex(c => c.value == currency.value) == -1);
                });
            },

            additionalCurrenciesOptions() {
                console.log("additional");
                return this.allCurrencyOptions.filter((currency)=> {
                    return this.defaultCurrency.value != currency.value;
                });
            },

            currencies: {
                get() {
                    return this.$store.getters.user.settings['currencies'].map(currency => {
                        return { value: currency, text: currency }
                    });
                },
                set(currencies) {
                    this.$store.commit('setCurrencies', currencies.map(currency => currency.value));
                }
            },

            defaultCurrency: {
                get() {
                    return {
                        value: this.$store.getters.user.settings['defaultCurrency'],
                        text: this.$store.getters.user.settings['defaultCurrency']
                    };
                },
                set(currency) {
                    this.$store.commit('setDefaultCurrency', currency.value);
                }
            }
        },

        methods: {
            saveSettings() {
                this.loading = true;
                this.$store.dispatch('updateSettings').then(() => {
                    this.loading = false;
                    EventBus.$emit('notify', { message: 'Settings saved successfully', duration: 2000 });
                }).catch(() => {
                    this.loading = false;
                    EventBus.$emit('notify', { message: 'Could not save settings', duration: 2000 })
                });
            }
        },

        components: { SelectDropdown, MultiSelectDropdown, BeatingHeart }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .settings {
        .currency-settings {
            margin-top: 2.5rem;
        }
    }
</style>