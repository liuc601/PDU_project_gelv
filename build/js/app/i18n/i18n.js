define(function (require) {
    var Vue = require('vue');
    var VueI18n = require('vue-i18n');
    var i18n_en = require('i18n-dir/i18n_en');

    Vue.use(VueI18n);

    return new VueI18n({
        locale: 'en',
        messages: {
            'en': i18n_en,
        }
    });
});