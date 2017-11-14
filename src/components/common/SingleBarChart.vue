<template>
    <div class="single-bar-chart">
        <template v-for="(dataSet, i) in dataSets">
            <div
                    v-for="(data, j) in dataSet"
                    @mouseover="active([i,j])"
                    @mouseleave="active([i,j])"
                    :style="{ width: calculatePercent(data[1]) + '%', 'background-color': '#' + getColorFromText(data[0]) }"
                    :ref="i+''+j"
                    :title="tooltip(data[0],data[1])"
            >
            </div>
        </template>
    </div>
</template>

<script>
    import filters from '../../mixins/filters'

    export default {
        props: [ 'dataSets', 'totalValue' ],

        mixins: [ filters ],

        methods: {
            calculatePercent(value) {
                return ((value / this.totalValue) * 100);
            },
            active(indexes) {
                this.$emit('active', indexes);
            },
            tooltip(text, value) {
                return text+' - '+this.calculatePercent(value).toFixed(2)+'%';
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .single-bar-chart {
        display: flex;
        align-items: flex-end;
        width: 100%;

        div:hover {
            transition:all 0.1s ease;
            height: 100%;
            box-shadow: 0 0 3px $night-glow;
            z-index: 2;
        }

        div {
            height: 98%;
        }
    }
</style>