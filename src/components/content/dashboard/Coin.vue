<template>
    <tr>
        <td>
            <div class="asset-label">
                <span v-if="editable" class="asset-label__remove-asset-button" @click="remove"></span>
                <span class="asset-label__logo-icon cc" :class="[ticker.symbol+'-alt',ticker.symbol]" :style="{ 'color': '#'+getColorFromText(coin.identifier) }"></span>
                <span>{{ ticker.name }}</span>
            </div>
        </td>

        <td></td>

        <td>
            <finance-input :editable="editable" v-model="coin.amount" :max-digits="maxDigits">
                <template slot-scope="value">
                    {{ value.value | financify }}
                </template>
            </finance-input>
        </td>

        <td>{{ getCurrencySymbol(userDefaultCurrency) }}{{ ticker.price_usd * this.rates[userDefaultCurrency] | financify }}</td>

        <td v-for="currency in userCurrencies">
            {{ getCurrencySymbol(currency) }}{{ ticker.price_usd * rates[currency] * coin.amount | financify }}
        </td>

        <td class="portfolio-row__percent-change" :class="[ ((ticker.percent_change_1h>0) ? 'portfolio-row__percent-change--up' : 'portfolio-row__percent-change--down') ]">
            {{ ticker.percent_change_1h }}
        </td>

        <td class="portfolio-row__percent-change" :class="[ ((ticker.percent_change_24h>0) ? 'portfolio-row__percent-change--up' : 'portfolio-row__percent-change--down') ]">
            {{ ticker.percent_change_24h }}
        </td>

        <td class="portfolio-row__percent-change" :class="[ ((ticker.percent_change_7d>0) ? 'portfolio-row__percent-change--up' : 'portfolio-row__percent-change--down') ]">
            {{ ticker.percent_change_7d }}
        </td>

    </tr>
</template>

<script>
    import filters from '../../../mixins/filters'
    import FinanceInput from '../../common/FinanceInput.vue'

    export default {
        props: [ 'coin', 'ticker', 'rates', 'editable', 'index' ],

        mixins: [ filters ],

        data() {
            return {
                maxDigits: 15
            }
        },

        computed: {
            userCurrencies() {
                return this.$store.getters.userCurrencies;
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

        components: { FinanceInput }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @mixin icon($size,$font-size,$margin-right) {
        position: relative;
        display: block;
        width: $size;
        height: $size;
        margin-right: $margin-right;
        font-size: $font-size;
        line-height: 1;
    }

    .portfolio-row__percent-change {
        font-weight: 500;

        &--up {
            color: $night-success;

            &:after {
                font-family: FontAwesome;
                content: "\f176";
            }
        }

        &--down {
            color: $night-danger;

            &:after {
                font-family: FontAwesome;
                content: "\f175";
            }
        }
    }

    .asset-label {
        display: flex;
        align-items: center;

        &__logo-icon {
            @include icon(24px,22px,0.5rem);

            &::before {
                font-family: FontAwesome,"cryptocoins" !important;
                position:absolute;
                top:0;
                content: "\f111";
            }
        }

        &__remove-asset-button {
            @include icon(24px,24px,1.2rem);
            color: $night-danger;
            cursor: pointer;

            &::before {
                font-family: 'Material Icons';
                position:absolute;
                top:0;
                content: "remove_circle_outline";
            }

            &:hover {
                color: darken($night-danger,10%);
            }
        }
    }
</style>