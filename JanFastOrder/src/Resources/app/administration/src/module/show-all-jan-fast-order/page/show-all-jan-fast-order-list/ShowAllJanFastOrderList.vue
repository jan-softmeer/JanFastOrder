<template>
    <div class="show-all-jan-fast-order">
        <sw-page>
            <template v-slot:content>
                <h2>Items List</h2>
                <ul>
                    <li v-for="item in items" :key="item.id">
                        {{ item.name }} - {{ item.quantity }}
                    </li>
                </ul>
            </template>
        </sw-page>
    </div>
</template>

<script>
    import axios from 'axios';

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
                try {
                    const response = await axios.get('/api/v1/items');
                    this.items = response.data;
                } catch (error) {
                    console.error('Error loading items:', error);
                }
            }
        }
    }
</script>

<style scoped>
/* Optional: Styles für die Komponente */
</style>
