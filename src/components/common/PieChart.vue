<template>

    <vue-chart
            chart-type="PieChart"
            :columns="columns"
            :rows="rowsWithLabels"
            :options="options">
    </vue-chart>

</template>

<script>
    import Format from '../../Format.js'

    export default {
        props: {
            rows: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                columns: [{
                    'type': 'string',
                    'label': 'Portfolio'
                }, {
                    'type': 'number',
                    'label': 'Value'
                },{
                    'type': 'string',
                    'role': 'tooltip',
                    'p': { 'html': true }
                }],
                options: {
                    backgroundColor: {
                        fill: 'transparent'
                    },
                    width: 200,
                    height: 200,
                    pieHole: 0.5,
                    chartArea: {
                        left: 15,
                        top: 15,
                        width: 170,
                        height: 170
                    },
                    legend: {
                        position: 'none'
                    },
                    pieSliceText: 'none',
                    tooltip: {
                        isHtml: true,
                        ignoreBounds: true
                    }
                },
            }
        },

        computed: {
            rowsWithLabels() {
                this.rows.forEach(row => {
                    row.push(this.tooltip(row));
                });

                return this.rows;
            },

            totalValue() {
                let value = 0;
                this.rows.forEach(row => value += row[1]);
                return value;
            }
        },

        methods: {
            tooltip(row) {
                return `
                    <div class="chart-tooltip">
                        <span class="name">
                            ${row[0]}
                        </span>
                        <span class="value">
                            ${Format.number(2).format(row[1])} (${Format.number(0).format((row[1]/this.totalValue)*100)}%)
                        </span>
                    </div>
                `;
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .vue-chart-container .google-visualization-tooltip {
        background-color: lighten($night-blue-medium,10);
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
        border: none;
    }

    .chart-tooltip {
        padding: .4rem;

        .name {
            color: $night-blue-lighter;
            font-weight: 500;
        }
        .value {
            margin-left: .3rem;
            font-weight: 500;
            color: $night-gray;
        }
    }

    #defs ~ g path:first-of-type {
        stroke: $night-blue-medium;
        stroke-width: 3px;
    }
</style>