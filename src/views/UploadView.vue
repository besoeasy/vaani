<template>
  <div class="container p-4 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Upload Media to IPFS</h1>
    <input type="file" @change="handleFileChange" class="mb-4" />
    <button @click="uploadFile" class="px-4 py-2 text-white bg-blue-500 rounded">Upload</button>
    <div v-if="ipfsHash" class="mt-4">
      <p>File uploaded to IPFS:</p>
      <a :href="`https://ipfs.io/ipfs/${ipfsHash}`" target="_blank" class="text-blue-600">{{
        ipfsHash
      }}</a>
    </div>
  </div>
</template>

<script>
import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'

export default {
  data() {
    return {
      file: null,
      ipfsHash: null,
      helia: null,
      unixfs: null
    }
  },
  async mounted() {
    this.helia = await createHelia()
    this.unixfs = new unixfs(this.helia)
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0]
    },
    async uploadFile() {
      if (this.file) {
        try {
          const buffer = await this.file.arrayBuffer()
          const fileContent = new Uint8Array(buffer)
          const cid = await this.unixfs.addFile({ content: fileContent })
          this.ipfsHash = cid.toString()
        } catch (error) {
          console.error('Error uploading file:', error)
        }
      } else {
        alert('Please select a file first')
      }
    }
  }
}
</script>
