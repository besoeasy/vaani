import axios from 'axios'

const POOL_URL = localStorage.getItem('pool')

const PER_PAGE = 3 * 8

export const ipfsgateway = localStorage.getItem('ipfs') || 'https://dweb.link/ipfs/'

const graphQLRequest = async (query, variables = {}) => {
  try {
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
      console.error('GraphQL errors:', response.data.errors)
      return null
    }

    return response.data.data
  } catch (error) {
    console.error('Request failed:', error)
    return null
  }
}

export const randomCommit = async () => {
  const query = `query  {
   getRandomCommit {
    data
    type
    nonce
    publicKey
    signature
    createdAt
    updatedAt
  }
  }`

  const data = await graphQLRequest(query)

  if (data.getRandomCommit.type === 'post') {
    return data.getRandomCommit
  } else {
    return []
  }
}

export const fetchCommits = async (page) => {
  const query = `query GetCommits($page: Int!, $perPage: Int!) {
    getCommits(page: $page, perPage: $perPage) {
    data
    type
    nonce
    publicKey
    signature
    createdAt
    updatedAt
    }
  }`

  const variables = { page, perPage: PER_PAGE }
  const data = await graphQLRequest(query, variables)
  if (!data || !Array.isArray(data.getCommits)) {
    return []
  }

  return data.getCommits
}

export const commitbySignature = async (signature) => {
  const query = `query GetCommit($signature: String!) {
    getCommit(signature: $signature) {
    data
    type
    nonce
    publicKey
    signature
    createdAt
    updatedAt
    }
  }`

  const variables = { signature }

  const data = await graphQLRequest(query, variables)

  if (!data) {
    console.error('No data returned from GraphQL request')
    return null
  }

  return data.getCommit
}

export const fetchCommitsByAddress = async (publicKey, page) => {
  const query = `query getCommitsByUser($publicKey: String!, $page: Int!, $perPage: Int!) {
    getCommitsByUser(publicKey: $publicKey, page: $page, perPage: $perPage) {
    data
    type
    nonce
    publicKey
    signature
    createdAt
    updatedAt
    }
  }`

  const variables = { publicKey, page, perPage: PER_PAGE }
  const data = await graphQLRequest(query, variables)
  if (!data || !Array.isArray(data.getCommitsByUser)) {
    return []
  }

  return data.getCommitsByUser
}

export const getServerInfo = async () => {
  const query = `query GetServerInfo {
    getServerInfo {
      difficulty
      currentTime
      totalEntries
      totalAddresses
      oldestEntryDate
    }
  }`

  const data = await graphQLRequest(query)

  return data.getServerInfo
}
