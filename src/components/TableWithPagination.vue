<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useFetch } from "@vueuse/core";
const currentPage = ref(0);
const BE_URL = computed(() => {
  return `http://localhost:3000/users?page=${currentPage.value}`;
});
// just for fun
type MyResults = {
  id: number;
  name: string;
};
type MyDataResponse = {
  count: number;
  results: MyResults[];
};
const { data, isFetching, execute } = useFetch(BE_URL, {
  immediate: false,
  refetch: true,
})
  .get()
  .json<MyDataResponse>();
onMounted(() => {
  execute();
});
const isStartDisabled = ref(true);
const isEndDisabled = ref(false);
const getLastPageNumber = (totalCount: number, itemsPerPage = 10) => {
  return (
    Math.floor(totalCount / itemsPerPage) -
    (totalCount % itemsPerPage === 0 ? 1 : 0)
  );
};
watch(
  currentPage,
  () => {
    isStartDisabled.value = currentPage.value === 0;
    isEndDisabled.value =
      currentPage.value === getLastPageNumber(data.value!.count);
  },
  { immediate: false }
);
const paginationController = {
  start: () => {
    currentPage.value = 0;
  },
  end: () => {
    currentPage.value = getLastPageNumber(data.value!.count);
  },
  previous: () => {
    currentPage.value--;
  },
  next: () => {
    currentPage.value++;
  },
};
</script>
<template>
  <div :class="$style.table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="isFetching">
          <tr>
            <td colspan="2">Data is loading</td>
          </tr>
        </template>
        <template v-else-if="data">
          <tr v-for="item of data.results" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="pagination">
      <button :disabled="isStartDisabled" @click="paginationController.start">
        Start
      </button>
      <button
        :disabled="isStartDisabled"
        @click="paginationController.previous"
      >
        Previous
      </button>
      <button :disabled="isEndDisabled" @click="paginationController.next">
        Next
      </button>
      <button :disabled="isEndDisabled" @click="paginationController.end">
        End
      </button>
    </div>
  </div>
</template>

<style module>
.table {
  padding: 20px;
}
</style>
