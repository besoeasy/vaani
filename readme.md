# Vaani

Vaani is a peer-to-peer (P2P) communication framework inspired by Nostr. Unlike traditional centralized platforms, Vaani aims to facilitate truly decentralized and uniform implementation of secure communication protocols. With a focus on simplicity and interoperability, it enables users to exchange messages and data seamlessly while ensuring privacy and security.

---

## Key Features

- **Decentralized Communication**: Operates without a central authority, enabling peer-to-peer message exchange.
- **Cryptographic Security**: Utilizes modern cryptographic techniques for key generation, message signing, and encryption.
- **Flexible Data Structures**: Supports customizable templates for posts, metadata, and messages.
- **Proof of Work**: Implements difficulty-based verification to ensure computational integrity.
- **Uniform Implementation**: Promotes a single, consistent implementation to avoid fragmentation.
- **Built-in Templates**: Simplifies the creation of posts and metadata with predefined templates.

---

## Example Usage

```javascript
// Message Section
const message = "Hey Sir, how are you doing today?";
const encryptedMessage = encryptMessageWithPublicKey(message, publicKey);
const cmt = createCommit(privateKey, encryptedMessage, "message", 2);

// Post Section
const postContent = "This is a test post.";
const postHashtags = ["test", "post"];
const postAttachments = [
  { type: "image", url: "http://example.com/image.png" },
];
const postTags = [
  { key: "expireAt", value: "435345345" },
  { key: "createdAt", value: "435345345" },
];
const post = postTemplate(postContent, postHashtags, postAttachments, postTags);
const cmtPost = createCommit(privateKey, post, "post", 2);

// Meta User Section
const metaName = "Test User";
const metaAbout = "This is a test user.";
const metaImage = "http://example.com/image.png";
const metaWebsite = "http://example.com";
const metaFollowed = ["user1", "user2"];
const metaHashtags = ["test", "user"];
const meta = metaTemplate(metaName, metaAbout, metaImage, metaWebsite, metaFollowed, metaHashtags);
const cmtMeta = createCommit(privateKey, meta, "meta", 2);
```

Now you can relay `cmt` to any supported P2P network.

---

## Acknowledgments

Vaani draws inspiration from the Nostr protocol while emphasizing streamlined and focused P2P communication. Special thanks to the open-source community for their invaluable tools and resources.

---

## Why Not Nostr?

While Nostr has pioneered decentralized communication, it faces challenges that Vaani aims to overcome:

- **Fragmentation**: Nostr often feels like a web of disconnected implementations. It tries to mimic various platforms like Discord, Telegram, or Twitter, leading to inconsistency.
- **Lack of Direction**: The optional nature of NIPs (Nostr Improvement Proposals) results in a lack of a unified or linear progression for the protocol.
- **Overextension**: By attempting to integrate Bitcoin Lightning, Cashu, and other functionalities, Nostr spreads itself too thin, detracting from its primary goal of effective communication.

Vaani focuses on simplicity and consistency, ensuring a protocol that does one thing exceptionally well—secure, decentralized communication.

