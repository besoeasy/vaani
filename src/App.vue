<script setup>
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { computed, onMounted, ref } from 'vue'

const route = useRoute()

const isHome = computed(() => route.path === '/')

import { getGateway } from 'get-ipfs-gateway'

onMounted(async () => {
  const gateway = await getGateway()

  console.log('ipfs gateway : ', gateway)

  localStorage.setItem('ipfs', gateway)
})
</script>

<template>
  <div class="container p-10 m-auto">
    <div class="px-5 m-auto mb-10 text-black bg-yellow-100 rounded-2xl" v-if="!isHome">
      <div class="flex items-center justify-between h-8 px-4 py-8 font-bold uppercase md:text-lg">
        <RouterLink to="/timeline" class="router-link-active router-link-exact-active"
          >HOME</RouterLink
        >
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-4 text-sm md:space-x-8">
            <a class="">$</a>
          </div>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>
