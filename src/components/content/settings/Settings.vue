<template>
    <div class="settings">
        <h2>Settings</h2>

        <div class="row currency-settings">
            <div class="col-xl-8">
                    <select-dropdown v-model="defaultCurrency" :option-list="allCurrencies">Default Currency</select-dropdown>
                    <small class="select-hint">The primary currency. Used to display the latest prices and also used in most charts.</small>

                    <multi-select-dropdown v-model="currencies" :option-list="allCurrencies">Additional Currencies</multi-select-dropdown>
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
            allCurrencies() {
                let allCurrencies = this.$store.getters.allCurrencies.map(currency => {
                    return { value: currency, text: currency }
                });
                allCurrencies.push({ value: 'BTC', text: 'BTC' });
                return allCurrencies;
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