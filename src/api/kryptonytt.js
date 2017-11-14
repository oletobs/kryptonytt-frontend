import axios from 'axios';

const baseURL = 'https://alpha.kryptonytt.io:8443';
const api = axios.create({ baseURL: baseURL });

const kryptonytt = {
    signUp(user) {
        return axios.post(baseURL+'/user/sign-up', user);
    },

    login(username,password) {
        return axios.post(baseURL+'/login', { username: username, password: password });
    },

    getPortfolios(authToken) {
        return api.get('portfolios', { headers: { 'Authorization': authToken } });
    },

    addPortfolio(portfolio, authToken) {
        return api.post('portfolios',portfolio, { headers: { 'Authorization': authToken } });
    },

    updatePortfolio(portfolioName, portfolio, authToken) {
        return api.put('portfolios/'+portfolioName,portfolio, { headers: { 'Authorization': authToken } });
    },

    deletePortfolio(portfolioName, authToken) {
        return api.delete('portfolios/'+portfolioName, { headers: { 'Authorization': authToken } });
    },

    getPublicPortfolios() {
        // TODO: Public Portfolios
    },

    getUser(authToken) {
        return api.get('user', { headers: { 'Authorization': authToken } });
    },

    setUser(user, authToken) { // TODO: currently only takes settings, will be changed to user
        return api.put('user', user, { headers: { 'Authorization': authToken } });
    },
};

export default kryptonytt;