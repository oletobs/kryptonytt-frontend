<template>
    <div class="portfolio">

        <div class="row align-items-center justify-content-between portfolio-header">

            <div class="col-xl-3">

                <h4 class="portfolio-title" v-if="!editable">{{ portfolio.name }}</h4>

                <div v-else class="m-input-group m-input-group-flat">
                    <input type="text" v-model="portfolio.name" required>
                    <span class="bar"></span>
                    <label>Portfolio Name</label>
                </div>

            </div>

            <div class="col-xl-8">
                <portfolio-edit :portfolio="portfolio" :index="index" @editable="toggleEditable"></portfolio-edit>
            </div>

        </div>

        <div class="portfolio-table-container">

            <table class="table portfolio-table">

                <template v-if="portfolio.coins.length > 0">
                <thead>
                    <tr>
                        <th>Coin</th>
                        <th class="u-w10r" colspan="2">Amount</th>
                        <th class="u-w10r">Last Price</th>
                        <th class="u-w10r" v-for="currency in userCurrencies">
                            {{ currency }} Value
                        </th>
                        <th class="u-w5r">&Delta; 1H</th>
                        <th class="u-w5r">&Delta; 24H</th>
                        <th class="u-w5r">&Delta; 7D</th>
                    </tr>
                </thead>
                <tbody>
                    <coin
                            v-for="(coin, index) in portfolio.coins"
                            :index="index"
                            :editable="editable"
                            :coin="coin"
                            :ticker="tickerMap.get(coin.identifier)"
                            :rates="rates"
                            :class="{ 'table-active': activeAssets[0][index] }"
                            @remove="portfolio.coins.splice(index,1)"
                    >
                    </coin>
                </tbody>
                </template>

                <template v-if="portfolio.customAssets.length > 0">
                <thead>
                    <tr>
                        <th>Custom Assets</th>
                        <th class="u-w5r">Currency</th>
                        <th class="u-w10r">Amount</th>
                        <th class="u-w10r">Last Price</th>
                        <th class="u-w10r" v-for="currency in userCurrencies">
                            {{ currency }} Value
                        </th>
                        <th colspan="3"></th>
                    </tr>
                </thead>
                <tbody>
                    <custom-asset
                            v-for="(customAsset, index) in portfolio.customAssets"
                            :editable="editable"
                            :index="index"
                            :custom-asset="customAsset"
                            :rates="rates"
                            :class="{ 'table-active': activeAssets[1][index] }"
                            @remove="portfolio.customAssets.splice(index,1)"
                    >
                    </custom-asset>
                </tbody>
                </template>

                <template v-if="portfolio.fiat.length > 0">
                    <thead>
                    <tr>
                        <th>Fiat</th>
                        <th class="u-w5r">Currency</th>
                        <th class="u-w10r">Amount</th>
                        <th class="u-w10r">Last Price</th>
                        <th class="u-w10r" v-for="currency in userCurrencies">
                            {{ currency }} Value
                        </th>
                        <th colspan="3"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <fiat
                            v-for="(fiat, index) in portfolio.fiat"
                            :editable="editable"
                            :index="index"
                            :fiat="fiat"
                            :rates="rates"
                            :class="{ 'table-active': activeAssets[2][index] }"
                            @remove="portfolio.fiat.splice(index,1)"
                    >
                    </fiat>
                    </tbody>
                </template>

                <tfoot>
                    <tr>
                        <th colspan="4">Total</th>
                        <th v-for="currency in userCurrencies">
                            {{ getCurrencySymbol(currency) }}{{ statistics.marketValue * rates[currency] | financify }}
                        </th>
                        <th colspan="3"></th>
                    </tr>
                </tfoot>

            </table>

            <single-bar-chart
                    v-if="statistics.marketValue > 0"
                    class="portfolio-chart"
                    :dataSets="statistics.barChartData"
                    :totalValue="statistics.marketValue"
                    @active="toggleActiveAsset">
            </single-bar-chart>

        </div>

    </div>
</template>

<script>
    import filters from '../../../mixins/filters'
    import { EventBus } from '../../../EventBus'
    import Coin from './Coin.vue'
    import Fiat from './Fiat.vue'
    import CustomAsset from './CustomAsset.vue'
    import SingleBarChart from '../../common/SingleBarChart.vue'
    import PortfolioEdit from './PortfolioEdit.vue'

    export default {
        components: { Coin, Fiat, CustomAsset, SingleBarChart, PortfolioEdit },

        props: [ 'portfolio', 'rates', 'tickerMap', 'index' ],

        mixins: [ filters ],

        data() {
            return {
                editable: false,
                activeAssets: [[],[],[]]
            }
        },

        computed: {
            userCurrencies() {
                return this.$store.getters.userCurrencies;
            },

            userDefaultCurrency() {
                return this.userCurrencies[0];
            },

            statistics() {
                let statistics = {
                    marketValue: 0,
                    coinValue: 0,
                    fiatValue: 0,
                    customAssetValue: 0,
                    barChartData: [[],[],[]],
                };

                this.portfolio.coins.forEach(coin => {
                    statistics.coinValue += coin.amount * this.tickerMap.get(coin.identifier).price_usd;
                    statistics.barChartData[0].push([coin.identifier, coin.amount * this.tickerMap.get(coin.identifier).price_usd]);
                });

                this.portfolio.customAssets.forEach(customAsset => {
                    statistics.customAssetValue += (customAsset.amount * customAsset.price) / this.rates[customAsset.currency];
                    statistics.barChartData[1].push([customAsset.identifier, (customAsset.amount * customAsset.price) / this.rates[customAsset.currency]]);
                });

                this.portfolio.fiat.forEach(fiat => {
                    statistics.fiatValue += fiat.amount / this.rates[fiat.currency];
                    statistics.barChartData[2].push([fiat.identifier, fiat.amount / this.rates[fiat.currency]]);
                });

                statistics.marketValue = statistics.coinValue+statistics.fiatValue+statistics.customAssetValue;

                return statistics;
            }
        },

        methods: {
            toggleEditable(editable) {
                this.editable = editable;
            },
            toggleActiveAsset([assetTypeIndex,assetIndex]) {
                this.$set(this.activeAssets[assetTypeIndex], assetIndex, !this.activeAssets[assetTypeIndex][assetIndex]);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .portfolio {
        margin-bottom: 2.5rem;
    }

    .portfolio-table {
        text-align: right;
        white-space: nowrap;
        margin-bottom: 0;

        th:first-child, td:first-child{
            text-align: left;
        }
    }

    .portfolio-table-container {
        background-color: $night-blue-medium;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
    }

    .u-w15p {
        width: 15%;
    }

    .u-w5r {
        width: 5rem;
    }

    .u-w10r {
        width: 10rem;
    }

    .portfolio-header {
        height: calc(1.5rem + 10px);
        margin-bottom: 0.5rem;
    }

    .portfolio-title {
        margin: 0;
    }

    .portfolio-chart {
        height: 30px;
    }
</style>