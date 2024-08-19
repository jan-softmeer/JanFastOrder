<template>
    <div class="show-all-jan-fast-order">
        <sw-page>
            <template v-slot:content>
                <h2>Hello World</h2>
            </template>
        </sw-page>
    </div>
</template>

<script>
    export default {
        name: 'ShowAllJanFastOrderList',
        data() {
            return {
                items: [] // Array zum Speichern der abgerufenen Items
            };
        },
        metaInfo() {
            return {
                title: this.$createTitle()
            }
        },
        created() {
            this.loadItems(); // Items beim Erstellen der Komponente laden
        },
        methods: {
            async loadItems() {
                
            }
        }
    }
</script>

<style scoped>
/* Optional: Styles für die Komponente */
</style>
