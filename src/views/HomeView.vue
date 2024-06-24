<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'timeago.js'
import axios from 'axios'

async function getServerInfo(POOL_URL) {
  const query = `query ServerInfo {
  serverInfo {
    difficulty
    currentTime
    totalEntries
    totalUsers
    oldestEntryDate
  }
}
`

  const variables = {}

  const response = await axios.post(
    POOL_URL,
    {
      query,
      variables
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (response.data.errors) {
    console.error(response.data.errors)
    return null
  }

  return response.data.data.serverInfo
}

const router = useRouter()

const serverData = ref({
  difficulty: 0,
  currentTime: '2024-06-23T05:53:45.740Z',
  totalEntries: 0,
  totalUsers: 0,
  oldestEntryDate: '2024-06-23T02:33:45.581Z'
})

let pool = ref('https://pool.albertiprotocol.org/graphql')

const fetchServerInfo = async () => {
  console.log('Fetching server info : ' + pool.value)

  const data = await getServerInfo(pool.value)

  if (data) {
    console.log('server:', data)

    serverData.value = data
  }
}

const connect = async () => {
  localStorage.setItem('pool', pool.value)
  localStorage.setItem('difficulty', serverData.value.difficulty || 4)
  router.push('/timeline')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <div class="w-full lg:w-1/2">
      <div v-if="Object.keys(serverData).length > 0 && serverData.difficulty > 0">
        <h3 class="mb-4 text-2xl font-bold uppercase font-heading">Server Data</h3>
        <p>Server Pinged : {{ format(serverData.currentTime) }}</p>
        <p>Oldest Entry : {{ format(serverData.oldestEntryDate) }}</p>
        <p>Total Entries: {{ serverData.totalEntries }}</p>
        <p>Total Users: {{ serverData.totalUsers }}</p>
        <p>Current Difficulty: {{ serverData.difficulty }}</p>
      </div>
    </div>
    <div class="w-full lg:w-1/2">
      <div class="m-auto text-center">
        <h3 class="mb-8 text-2xl font-bold uppercase font-heading">Connect To Pool</h3>

        <input
          class="w-full py-3 pl-3 mb-4 bg-white border rounded-lg"
          type="text"
          v-model="pool"
        />
        <button
          @click="fetchServerInfo"
          class="inline-block w-full px-6 py-3 mb-4 text-sm font-bold leading-loose text-white transition duration-200 bg-gray-500 rounded hover:bg-gray-600"
        >
          Fetch
        </button>
        <button
          @click="connect"
          v-if="serverData.difficulty > 1"
          type="submit"
          class="inline-block w-full px-6 py-3 mb-4 text-sm font-bold leading-loose text-white transition duration-200 bg-gray-500 rounded hover:bg-gray-600"
        >
          Connect
        </button>
      </div>
    </div>
  </div>
</template>
