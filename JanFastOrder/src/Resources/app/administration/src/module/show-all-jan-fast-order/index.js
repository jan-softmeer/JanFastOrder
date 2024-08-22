
//TODO: Das Modul wird nicht angezeigt, obwohl keine Fehler auftreten.

import './page/show-all-jan-fast-order-list';

import deDE from './snippet/de-DE';
import enGB from './snippet/en-GB';

Shopware.Module.register('show-all', {
    type: 'plugin',
    color: '#ffffff',
    icon: 'default-package-open',
    title: 'show-all-jan-fast-order.general.showAllFastOrders',
    description: 'show-all-jan-fast-order.general.descriptionShowAllFastOrders',
    name: 'show-all',

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