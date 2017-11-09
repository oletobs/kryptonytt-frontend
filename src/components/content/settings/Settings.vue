<template>
    <div class="settings">
        <h2>Settings</h2>

        <div class="row currency-settings">
            <div class="col-xl-8">
                    <select-dropdown v-model="defaultCurrency" :option-list="defaultCurrencyOptions">Default Currency</select-dropdown>
                    <small class="select-hint">The primary currency. Used to display the latest prices and also used in most charts.</small>

                    <multi-select-dropdown v-model="currencies" :option-list="additionalCurrenciesOptions">Additional Currencies</multi-select-dropdown>
                    <small class="select-hint">Portfolio values and asset values will also be shown in these currencies.</small>
            </div>
        </div>

    </div>
</template>

<script>
    import SelectDropdown from '../../common/SelectDropdown.vue'
    import MultiSelectDropdown from '../../common/MultiSelectDropdown.vue'

    export default {
        props: {

        },

        computed: {
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
                    return this.$store.state.user.settings['currencies'].map(currency => {
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
                        value: this.$store.state.user.settings['default-currency'],
                        text: this.$store.state.user.settings['default-currency']
                    };
                },
                set(currency) {
                    this.$store.commit('setDefaultCurrency', currency.value);
                }
            }
        },

        components: { SelectDropdown, MultiSelectDropdown }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .settings {
        .currency-settings {
            margin-top: 2.5rem;
        }
    }
</style>