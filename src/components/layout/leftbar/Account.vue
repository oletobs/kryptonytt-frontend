<template>

    <div class="login-panel" key="login">

        <div class="m-input-group">
            <input type="text" v-model="userInput.username" @input="inputInvalid.username = false" :class="{ 'invalid': inputInvalid.username }" required>
            <span class="bar"></span>
            <label>Username</label>
            <span class="invalid-message" v-if="inputInvalid.username">Required and must be minimum 3 characters.</span>
        </div>

        <div class="m-input-group">
            <input type="password" v-model="userInput.password" @input="inputInvalid.password = false" :class="{ 'invalid': inputInvalid.password }" required>
            <span class="bar"></span>
            <label>Password</label>
            <span class="invalid-message" v-if="inputInvalid.password">Required and must be minimum 3 characters.</span>
        </div>

        <button class="m-button m-button-block" @click="login" :disabled="loadingAny">
            <beating-heart v-if="loading.login"></beating-heart>
            <template v-else>Login</template>
        </button>

        <button class="m-button m-button-block" @click="signUp" :disabled="loadingAny">
            <beating-heart v-if="loading.signUp"></beating-heart>
            <template v-else>Create User</template>
        </button>

        <small class="signup-message">No bullshit required. Enter a username and password and you're good to go.</small>

        <button class="m-button m-button-block" @click="goOffline" :disabled="loadingAny">
            Offline Mode
        </button>

        <small class="signup-message">No user required. Portfolio data is saved in browsers local storage, and is only available on this device.</small>
    </div>

</template>

<script>
    import { mapState } from 'vuex'
    import { EventBus } from '../../../EventBus'
    import BeatingHeart from '../../common/BeatingHeart.vue'

    export default {
        data() {
            return {
                userInput: {
                    username: '',
                    password: '',
                },
                inputInvalid: {
                    username: false,
                    password: false
                },
                loading: {
                    login: false,
                    signUp: false
                }
            }
        },

        computed: {
            loadingAny() {
                return this.loading.login || this.loading.signUp;
            }
        },

        methods: {
            login() {
                if(!this.validateInput()) return 0;
                this.loading.login = true;
                this.$store.dispatch('login', {username: this.userInput.username, password: this.userInput.password}).then(() => {
                    this.loading.login = false;
                    this.getPortfolios();
                }).catch(() => {
                    EventBus.$emit('notify',{ message: 'Wrong username/password', duration: 2000 });
                    this.loading.login = false;
                });
            },
            signUp() {
                if(!this.validateInput()) return 0;
                this.loading.signUp = true;
                this.$store.dispatch('signUp', {username: this.userInput.username, password: this.userInput.password}).then(()=> {
                    this.loading.signUp = false;
                }).catch(() => {
                    EventBus.$emit('notify',{ message: 'Username already taken', duration: 2000 });
                    this.loading.signUp = false;
                });
            },
            goOffline() {
                this.$store.dispatch('goOffline');
            },
            getPortfolios() {
                this.$store.dispatch('getPortfolios');
            },
            validateInput() {
                let valid = true;
                if(this.userInput.username.length < 3) {
                    this.inputInvalid.username = true;
                    valid = false;
                }
                if(this.userInput.password.length < 3) {
                    this.inputInvalid.password = true;
                    valid = false;
                }
                return valid;
            }
        },

        components: { BeatingHeart }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .login-panel {
        padding: 0 2rem;
        margin-top: 5rem;

        button:first-of-type {
            margin: 5rem 0 1rem 0;
        }

        button:last-of-type {
            margin-top: 5rem;
        }

        .signup-message {
            margin-top: .5rem;
            display: block;
            width: 100%;
            text-align: center;
        }
    }
</style>