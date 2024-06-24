<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
    <div
      v-for="commit in commits"
      :key="commit.signature"
      class="p-5 py-8 text-left transition-transform duration-300 bg-white rounded-md shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1"
    >
      <RouterLink :to="`/post/${commit.signature}`">
        <div class="mb-4">
          <p class="text-xs font-bold text-gray-500">
            <RouterLink :to="`/profile/${commit.publicKey}`">{{
              trim(commit.publicKey)
            }}</RouterLink>
            -
            {{ format(commit.updatedAt) }}
          </p>
          <h1 class="mt-2 mb-4 text-xl font-extrabold text-gray-800">
            {{ commit.data.content || '' }}
          </h1>
        </div>

        <div
          v-if="commit.data.hashtags && commit.data.hashtags.length > 0"
          class="flex flex-wrap mb-4"
        >
          <span
            v-for="hashtag in commit.data.hashtags"
            :key="hashtag"
            class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded"
          >
            {{ hashtag }}
          </span>
        </div>

        <div v-if="commit.data.attachments && commit.data.attachments.length > 0">
          <div v-for="attachment in commit.data.attachments" :key="attachment.cid" class="mb-4">
            <img
              v-if="attachment.type === 'image' && attachment.cid"
              :src="`${ipfsgateway}${attachment.cid}`"
              alt="Attachment Image"
              class="w-full rounded-lg"
            />
            <img
              v-if="attachment.type === 'image' && attachment.url"
              :src="`${attachment.url}`"
              alt="Attachment Image"
              class="w-full rounded-lg"
            />
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { format } from 'timeago.js'

import { ipfsgateway } from '@/config.js'

defineProps({
  commits: Array
})

const trim = (str, length) => {
  return str.slice(0, 4) + '***' + str.slice(-8)
}
</script>
