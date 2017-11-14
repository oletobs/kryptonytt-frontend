<template>
    <nav>

        <div class="side-nav__top" :class="{ 'jumbo': !loggedIn && !offlineMode }">

            <div class="brand" :class="{ 'jumbo': !loggedIn && !offlineMode }">

                <svg class="brand__logo" viewBox="0 0 72 62.302498" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(366.17 98.952)">
                            <g transform="matrix(.51796 0 0 .51796 -240.93 -122.16)">
                                <path transform="matrix(.26458 0 0 .26458 -71.583 76.812)" d="m-496.19-120.93c-44.254 0-81.598 13.191-107.55 38.594-25.956 25.403-39.582 62.229-39.582 105.78 0 37.756 16.856 70.724 33.338 94.6 16.024 23.213 30.521 36.728 34.416 40.176l8.5137 8.2129 58.758-33.922-22.344-21.537-0.0137-0.0156c-1.5735-1.5727-0.556-0.52834-0.90039-0.85742-0.35036-0.33449-0.86528-0.82694-1.5215-1.4766-1.3124-1.2992-3.1971-3.2232-5.4629-5.6758-4.5315-4.9051-10.57-11.947-16.52-20.344-11.899-16.794-22.885-38.921-22.885-59.16 0-35.459 10.89-53.113 25.703-64.059 14.813-10.945 35.779-14.926 56.051-14.926h4e-3c15.192 0 35.091 9.2701 52.33 21.598 17.239 12.328 32.001 27.314 38.186 34.687l-0.0664-0.080078c2.0126 2.4318 4.2791 4.4878 6.7168 6.1758v-89.029c-24.813-19.464-58.451-38.742-97.166-38.742z" fill="#edcc7c"></path>
                                <path transform="matrix(.26458 0 0 .26458 -71.583 76.812)" d="m-265.09-120.93c-38.715 0-72.354 19.277-97.168 38.74v89.033c2.4391-1.6884 4.7052-3.7447 6.7188-6.1777l-0.0664 0.080078c6.1844-7.3737 20.94-22.36 38.18-34.687 17.239-12.328 37.144-21.598 52.336-21.598 20.271 0 41.231 3.9803 56.045 14.926 14.813 10.945 25.711 28.6 25.711 64.059 0 20.239-10.981 42.362-22.914 59.189-5.9665 8.4138-12.03 15.486-16.602 20.432-2.2857 2.4727-4.2032 4.4156-5.5449 5.7441-0.6709 0.66425-1.1941 1.1729-1.5644 1.5273-0.29291 0.28045-0.32316 0.29481-0.75977 0.72461l-0.18554 0.17579-0.0156 0.0156-22.057 21.256 58.936 34.027 8.293-7.9883 0.0957-0.0957c-0.622 0.62203 1.3581-1.2755 3.3965-3.2988 2.0384-2.0234 4.7866-4.8322 7.9941-8.3281 6.415-6.992 14.681-16.746 22.936-28.715 16.51-23.937 33.373-56.91 33.373-94.666 0-43.553-13.626-80.378-39.582-105.78-25.956-25.403-63.301-38.594-107.55-38.594z" fill="#63bd63"></path>
                                <path transform="matrix(.26458 0 0 .26458 -71.583 76.812)" d="m-480.76 159.06-58.773 33.932 136.12 131.32c6.2635 6.2636 14.593 9.3691 22.766 9.3691s16.51-3.1056 22.773-9.3691l136.27-131.24-58.922-34.018-100.12 96.492z" fill="#ed8e7c"></path>
                            </g>
                        </g>
                    </svg>
                <span class="brand__name">KRYPTONYTT</span>

            </div>

            <transition name="fade-login" mode="out-in">

                <div class="menu-panel" v-if="loggedIn || offlineMode">
                    <div class="user-panel">

                        <div class="user-panel__head" @click="showSettings = !showSettings">

                            <span class="default-user-icon">
                                <i class="material-icons">person</i>
                                {{ username }}
                            </span>

                            <i class="drop-down-arrow material-icons">arrow_drop_{{ showSettings ? 'up' : 'down' }}</i>

                        </div>

                        <div class="user-panel__menu"  v-if="showSettings">

                            <div class="m-list-group m-list-group-small m-list-group-hover">

                                <router-link class="m-list-group-item" to="/username">
                                    <i class="material-icons">public</i>
                                    Public Page
                                </router-link>

                                <button class="m-list-group-item" @click="logout" v-if="loggedIn">
                                    <i class="material-icons">exit_to_app</i>
                                    Sign out
                                </button>

                                <button class="m-list-group-item" @click="goOnline" v-else>
                                    <i class="material-icons">person_add</i>
                                    Create User
                                </button>

                                <hr>

                            </div>

                            <div class="m-list-group m-list-group-small">

                                <span class="m-list-group-item m-list-group-item-note">Quick Settings</span>

                                <check-box class="m-list-group-item" v-model="nightMode">Night Mode</check-box>

                                <check-box class="m-list-group-item" v-model="autoSyncApi">Auto sync API</check-box>

                            </div>
                        </div>

                    </div>

                    <ul class="m-list-group">

                        <router-link class="m-list-group-item" :to="{ name: 'dashboard' }">
                            <i class="material-icons">dashboard</i>
                            Dashboard
                        </router-link>

                        <router-link class="m-list-group-item" :to="{ name: 'settings' }">
                            <i class="material-icons">settings</i>
                            Settings
                        </router-link>

                    </ul>
                </div>

                <account v-else></account>

            </transition>

        </div>

        <div class="side-nav__bottom">

            <div class="api-info">

                <i class="material-icons api-info__clock">
                    <template v-if="apiLoading">sync</template>
                    <template v-else-if="autoSyncApi">update</template>
                    <template v-else>sync_disabled</template>
                </i>

                <div class="api-info-text">

                    <div class="api-info-text__description">Fiat</div>
                    <div class="api-info-text__time">{{ fiatLastUpdated | dateify }}</div>

                </div>

                <div class="api-info-text">

                    <div class="api-info-text__description">Crypto</div>
                    <div class="api-info-text__time">{{ cryptoLastUpdated | dateify }}</div>

                </div>

            </div>

        </div>

    </nav>
</template>

<script>
    import filters from '../../../mixins/filters'
    import Account from './Account.vue'
    import CheckBox from '../../common/CheckBox.vue'

    export default {
        mixins: [ filters ],

        props: [ 'show', 'fiatLastUpdated', 'cryptoLastUpdated', 'apiLoading' ],

        data() {
            return {
                showSettings: false
            }
        },

        computed: {
            loggedIn() {
                return this.$store.state.loggedIn;
            },

            offlineMode() {
                return this.$store.state.offlineMode;
            },

            username() {
                return this.$store.getters.user.username;
            },

            nightMode: {
                get() {
                    return this.$store.getters.user.settings['nightMode'];
                },
                set() {
                    this.$store.dispatch('toggleNightMode');
                }
            },

            autoSyncApi: {
                get() {
                    return this.$store.getters.user.settings['autoSyncApi'];
                },
                set() {
                    this.$store.dispatch('toggleAutoSyncApi');
                }
            }
        },

        methods: {
            logout() {
                this.$store.dispatch('logout');
                this.showSettings = false;
            },
            goOnline() {
                this.$store.commit('setOfflineMode', false);
                this.showSettings = false;
            }
        },

        components: {
            Account, CheckBox
        }

    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .side-nav {
        background-color: $night-blue-medium;
        box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
        position: sticky;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        top: 0;
        min-height: 100vh;
        height: 100%;
        padding: 0;
    }

    .side-nav__top {
        width: 220px;
        transition: .4s ease-in-out width;
        transition-delay: .9s;

        &.jumbo {
            width: 400px;
            transition: .4s ease-in-out width;
            transition-delay: .5s;
        }
    }

    .brand {
        border-bottom: 1px solid $night-blue-dark;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 4rem;
        transition: .4s ease-in-out height, .4s ease-in-out background, .4s ease-in-out box-shadow;
        transition-delay: .5s;

        &__logo {
            width: 1.8rem;
            height: 1.8rem;
            margin-top: 3px;
            transition: .4s ease-in-out all;
            transition-delay: .5s;
        }

        &__name {
            font-size: 1.5rem;
            margin-left: 0.5rem;
            font-weight: 500;
            transition: .4s ease-in-out all;
            transition-delay: .5s;
        }

        &.jumbo {
            height: 8rem;
            background-color: lighten($night-blue-medium,5);
            box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
            transition: 0.4s ease-in-out height, .4s ease-in-out background, .4s ease-in-out box-shadow;
            transition-delay: .9s;

            .brand__name {
                font-size: 2.5rem;
                transition: .4s ease-in-out all;
                transition-delay: .9s;
            }

            .brand__logo {
                width: 3rem;
                height: 3rem;
                transition: .4s ease-in-out all;
                transition-delay: .9s;
            }
        }
    }

    .api-info {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;

        i+div:not(:last-child) {
            margin: 0 1rem;
        }
    }

    .api-info__clock {
        text-align: center;
    }

    .api-info-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &__time {
            font-size: 0.8rem;
            line-height: 100%;
        }

        &__description {
            font-size: 0.7rem;
            font-weight: bold;
        }
    }

    .user-panel__head {
        padding: 0.75rem 1rem;
        background-color: darken($night-blue-medium, 2%);
        border-bottom: 1px solid $night-blue-dark;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        user-select: none;

        span {
            display: flex;
            align-items: center;
        }

        .drop-down-arrow {
            font-size: 22px;
        }
    }

    .user-panel__menu {
        background-color: darken($night-blue-medium, 4%);
        border-bottom: 1px solid $night-blue-dark;
        padding: 0.5rem 0;
    }

    .fade-login-enter-active.login-panel {
        transition: opacity .5s;
        transition-delay: .9s;
    }

    .fade-login-enter-active.menu-panel {
        transition: opacity .5s;
        transition-delay: .3s;
    }

    .fade-login-leave-active.menu-panel {
        transition: opacity .5s;
    }

    .fade-login-leave-active {
        transition: opacity .5s;
    }

    .fade-login-enter, .fade-login-leave-to {
        opacity: 0;
    }
</style>