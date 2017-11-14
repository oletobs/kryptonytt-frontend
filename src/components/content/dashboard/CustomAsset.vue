<template>
    <tr>
        <td>
            <div class="asset-label">
                <span v-if="editable" class="asset-label__remove-asset-button" @click="remove"></span>
                <span class="asset-label__logo-icon" :style="{ 'color': '#'+getColorFromText(customAsset.identifier) }"></span>
                <div v-if="editable" class="m-input-group m-input-group-table">
                    <input type="text" v-model="customAsset.identifier" required>
                    <span class="bar"></span>
                </div>
                <span v-else>{{ customAsset.identifier }}</span>
            </div>
        </td>

        <td>
            <select-dropdown :value="{ value: customAsset.currency, text: customAsset.currency }"
                             @input="option => customAsset.currency = option.value"
                             :option-list="allCurrencies"
                             class="m-select-group-table"
                             v-if="editable">
            </select-dropdown>
            <span v-else>{{ customAsset.currency }}</span>
        </td>

        <td>
            <finance-input :editable="editable" v-model="customAsset.amount" :max-digits="maxDigits">
                <template slot-scope="value">
                    {{ value.value | financify }}
                </template>
            </finance-input>
        </td>

        <td>
            <finance-input :editable="editable" v-model="customAsset.price" :max-digits="maxDigits">
                <template slot-scope="value">
                    {{ value.value | financify }}
                </template>
            </finance-input>
        </td>

        <td v-for="currency in userCurrencies">
            {{ getCurrencySymbol(currency) }}{{ ((customAsset.amount * customAsset.price) / rates[customAsset.currency]) * rates[currency] | financify }}
        </td>

        <td colspan="3"></td>
    </tr>
</template>

<script>
    import filters from '../../../mixins/filters'
    import FinanceInput from '../../common/FinanceInput.vue'
    import SelectDropdown from '../../common/SelectDropdown.vue'

    export default {
        props: [ 'customAsset', 'rates', 'editable', 'index' ],

        mixins: [ filters ],

        data() {
            return {
                maxDigits: 15,
            }
        },

        computed: {
            userCurrencies() {
                return this.$store.getters.userCurrencies;
            },

            allCurrencies() {
                return this.$store.getters.allCurrencies.map(currency => {
                    return { value: currency, text: currency }
                });
            },

            userDefaultCurrency() {
                return this.userCurrencies[0];
            }
        },

        methods: {
            remove() {
                this.$emit('remove', this.index);
            }
        },

        components: { FinanceInput, SelectDropdown }
    }
</script>

<style lang="scss" rel="stylesheet/scss">

</style>