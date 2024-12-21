# Vaani

Vaani is a peer-to-peer (P2P) communication framework inspired by Nostr. Unlike traditional centralized platforms, Vaani aims to facilitate truly decentralized and uniform implementation of secure communication protocols. With a focus on simplicity and interoperability, it enables users to exchange messages and data seamlessly while ensuring privacy and security.

---

## Features

- **Decentralized Communication**: Operates without a central authority, enabling peer-to-peer message exchange.
- **Cryptographic Security**: Utilizes modern cryptographic techniques for key generation, message signing, and encryption.
- **Flexible Data Structures**: Supports customizable templates for posts, metadata, and messages.
- **Proof of Work**: Includes difficulty-based verification to ensure computational integrity.
- **Uniform Implementation**: Provides a single, consistent implementation to avoid fragmentation.
- **Built-in Templates**: Simplifies the creation of posts and metadata with predefined templates.

---


## Example 

```javascript
// Message Section
// Define a message to be encrypted and sent
const message = "Hey Sir how are you doing today?";

// Encrypt the message using the recipient's public key
const encryptedMessage = encryptMessageWithPublicKey(message, publicKey);

// Create a commit for the encrypted message
// Parameters: private key for signing, the encrypted message, type of commit ("message"), and version (2)
const cmt = createCommit(privateKey, encryptedMessage, "message", 2);

// Post Section
// Define the content of the post
const postContent = "This is a test post.";

// Specify hashtags associated with the post
const postHashtags = ["test", "post"];

// Add any attachments to the post, e.g., an image
const postAttachments = [
  { type: "image", url: "http://example.com/image.png" },
];

// Add metadata tags for the post, such as expiration and creation timestamps
const postTags = [
  { key: "expireAt", value: "435345345" }, // Expiration timestamp
  { key: "createdAt", value: "435345345" }, // Creation timestamp
];

// Generate the post object using a predefined template
const post = postTemplate(postContent, postHashtags, postAttachments, postTags);

// Create a commit for the post
// Parameters: private key for signing, the post object, type of commit ("post"), and version (2)
const cmt = createCommit(privateKey, post, "post", 2);

// Meta User Section
// Define metadata for a user
const metaName = "Test User"; // User's name
const metaAbout = "This is a test user."; // Short description about the user
const metaImage = "http://example.com/image.png"; // URL to the user's profile image
const metaWebsite = "http://example.com"; // User's personal or professional website
const metaFollowed = ["user1", "user2"]; // List of usernames the user follows
const metaHashtags = ["test", "user"]; // Hashtags associated with the user

// Generate the metadata object using a predefined template
const meta = metaTemplate(
  metaName,
  metaAbout,
  metaImage,
  metaWebsite,
  metaFollowed,
  metaHashtags
);

// Create a commit for the metadata
// Parameters: private key for signing, the metadata object, type of commit ("meta"), and version (2)
const cmt = createCommit(privateKey, meta, "meta", 2);
```


    Now you can relay cmt to anywhere 

## Acknowledgments

Vaani draws inspiration from the Nostr protocol, with a focus on P2P communication. Special thanks to the open-source community for their invaluable tools and resources.
