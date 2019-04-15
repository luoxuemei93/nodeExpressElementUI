import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import page from './module/page.js';
import getters from './getters';

const store = new Vuex.Store({
    modules: {
        page
    },
    getters
});

export default store;
