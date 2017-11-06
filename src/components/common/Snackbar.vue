<template>
    <div class="snackbar">
        <div class="snackbar-message">
            {{ message }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            message: {
                type: String,
                required: true
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .snackbar {
        position: fixed;
        left: 50%;
        bottom: 24px;
        display: flex;
        background: #323232;
        z-index: 100;
        transform: translate(-50%, 0px);
        min-width: 288px;
        font-size: 14px;
        line-height: 48px;
        height: 48px;

        .snackbar-message {
            color: $white;
            margin-left: 24px;
            font-family: 'Roboto', sans-serif;
        }
    }

    .fade-snackbar-enter-active {
        animation: fadein 0.5s;
    }

    .fade-snackbar-leave-active {
        animation: fadeout 0.5s;
    }

    @keyframes fadein {
        from {bottom: -48px; opacity: 0;}
        to {bottom: 24px; opacity: 1;}
    }

    @keyframes fadeout {
        from {bottom: 24px; opacity: 1;}
        to {bottom: -48px; opacity: 0;}
    }
</style>