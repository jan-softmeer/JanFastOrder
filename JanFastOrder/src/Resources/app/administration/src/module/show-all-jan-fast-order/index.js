// <plugin root>/src/Resources/app/administration/src/module/show-all-jan-fast-order/index.js

//http://localhost/admin#/show/all/jan/fast/order/list


import './page/show-all-jan-fast-order-list';

import deDE from './snippet/de-DE';
import enGB from './snippet/en-GB';

Shopware.Module.register('show-all', {
    type: 'plugin',
    color: '#ffffff',
    icon: 'default-package-open',
    title: 'show-all-jan-fast-order.general.showAllFastOrders',
    description: 'show-all-jan-fast-order.general.descriptionShowAllFastOrders',
    name: 'jan-bundles',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        list: {
            component: 'show-all-jan-fast-order-list',
            path: 'list'
        },
    },

    navigation: [{
        label: 'show-all-jan-fast-order.general.showAllFastOrders',
        color: '#ffffff',
        path: 'show.all.list',
        icon: 'default-package-open',
        position: 100,
    }]
})