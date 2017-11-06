<template>
    <div class="single-bar-chart">

        <div
                v-for="o in data"
                @mouseover="toggleActive(o)"
                @mouseleave="toggleActive(o)"
                :class="isActive(o) ? 'active' : ''"
                :style="{ width: o.percent + '%', 'background-color': '#' + o.color }"
                :ref="o.id"
                :title="tooltip(o)"
        >
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                required: true
            },
            active: {
                type: Object,
                required: true
            }
        },

        methods: {
            toggleActive(o) {
                this.$emit('toggleActive', o.id)
            },
            isActive(o) {
                return this.active[o.id];
            },
            tooltip(o) {
                return o.name+' - '+o.percent.toFixed(2)+'%';
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .single-bar-chart {
        display: flex;
        align-items: flex-end;
        width: 100%;

        .active {
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