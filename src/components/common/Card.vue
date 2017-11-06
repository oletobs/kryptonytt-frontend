<template>
    <div class="card">

        <div class="card-content row flex-nowrap no-gutters">

            <div class="card-content__main col">

                <slot name="header"></slot>

                <slot name="content"></slot>

            </div>

            <div class="card-content__side col-auto">

                <slot name="side"></slot>

            </div>

        </div>

    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .card {
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
        height: 100%;
        border: none;

        &-content {
            height: 100%;
        }

        &-content__main {
            padding: .75rem .75rem .75rem .75rem !important;
            display: flex;
            flex-direction: column;
        }

        &-content__side {
            padding: 0;
            background: darken($night-blue-medium, 3);
        }
    }
</style>