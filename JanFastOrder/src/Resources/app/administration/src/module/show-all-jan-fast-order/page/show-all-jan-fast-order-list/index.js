
import template from './show-all-jan-fast-order-list.html.twig';

Shopware.Component.register('show-all-jan-fast-order-list', {
    template,

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },
});


// import template from './ShowAllJanFastOrderList.vue';

// Shopware.Component.register('show-all-jan-fast-order-list', template);
