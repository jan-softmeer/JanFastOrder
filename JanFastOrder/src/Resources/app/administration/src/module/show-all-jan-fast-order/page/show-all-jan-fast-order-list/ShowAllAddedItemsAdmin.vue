<template>
  <div>
    <h1>Added Items</h1>
    <table>
      <thead>
        <tr>
          <th>Datetime</th>
          <th>SessionID</th>
          <th>Product Number</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in groupedItems" :key="item.id" :class="getRowClass(index)">
          <td>{{ item.created_at }}</td>
          <td>{{ item.session_id }}</td>
          <td>{{ item.product_number }}</td>
          <td>{{ item.quantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
      data() {
          return {
              items: [],
          };
      },
      computed: {
          groupedItems() {
              // Group items by session_id and alternate colors
              let currentSessionId = null;
              let isGray = false;

              return this.items.map(item => {
                  if (item.session_id !== currentSessionId) {
                    currentSessionId = item.session_id;
                    isGray = !isGray;
                  }
                  return {
                    ...item,
                    isGray,
                  };
              });
          },
      },
      methods: {
        fetchItems() {
            this.$http
              .get('/api/fastorder/get-added-items-admin')
              .then(response => {
                  this.items = response.data;
              })
              .catch(error => {
                  console.error('Error fetching items:', error);
              });
        },
        getRowClass(index) {
            return this.groupedItems[index].isGray ? 'gray-row' : 'white-row';
        },
      },
      mounted() {
          this.fetchItems();
      },
  };
</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
  }

  thead th {
    background-color: #f2f2f2;
  }

  .gray-row {
    background-color: #f2f2f2;
  }

  .white-row {
    background-color: #ffffff;
  }
</style>
