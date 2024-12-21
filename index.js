// Use a polyfill for the 'crypto' module in browsers
const isBrowser = typeof window !== "undefined";

// Polyfill Buffer in the browser if necessary
if (isBrowser && typeof Buffer === "undefined") {
  window.Buffer = require("buffer").Buffer;
}

// Import necessary modules based on the environment
let CryptoJS, EC;
if (isBrowser) {
  CryptoJS = require("crypto-js");
  EC = require("elliptic").ec;
} else {
  CryptoJS = require("crypto-js");
  EC = require("elliptic").ec;
}

const curve = new EC("p521");

// Function to generate a new key pair with compressed public key
function genKeys() {
  const keyPair = curve.genKeyPair();
  const privateKey = keyPair.getPrivate("hex");
  const publicKey = keyPair.getPublic(true, "hex"); // true for compressed
  return { privateKey, publicKey };
}

// Function to convert private key to public key
function privToPub(privateKey) {
  const keyPair = curve.keyFromPrivate(privateKey, "hex");
  return keyPair.getPublic(true, "hex"); // true for compressed
}

// Function to sign a message
function signMsg(privateKeyHex, message) {
  const privateKey = curve.keyFromPrivate(privateKeyHex, "hex");
  const messageBuffer = Buffer.from(message, "utf-8");
  const signature = privateKey.sign(messageBuffer);
  return signature.toDER("hex");
}

// Function to verify a message against a signature
function verifySig(publicKeyHex, message, signatureHex) {
  const publicKey = curve.keyFromPublic(publicKeyHex, "hex");
  const messageBuffer = Buffer.from(message, "utf-8");
  const signature = Buffer.from(signatureHex, "hex");
  return publicKey.verify(messageBuffer, signature);
}

// Function to verify difficulty
function checkDifficulty(difficulty, hash) {
  return hash.startsWith("0".repeat(difficulty));
}

// Function to hash a message
function hashMsg(message) {
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

// Function to encrypt a message with a public key
function encryptMsg(message, recipientPublicKey) {
  const recipientKey = curve.keyFromPublic(recipientPublicKey, "hex");
  const ephemeralKey = curve.genKeyPair();
  const sharedSecret = ephemeralKey.derive(recipientKey.getPublic());
  const sharedKey = CryptoJS.SHA256(sharedSecret.toString(16)).toString();
  const ciphertext = CryptoJS.AES.encrypt(message, sharedKey).toString();
  const ephemeralPublicKey = ephemeralKey.getPublic("hex");
  return { ciphertext, ephemeralPublicKey, recipientPublicKey };
}

// Function to decrypt a message with a private key
function decryptMsg(encryptedMessage, recipientPrivateKey) {
  const { ciphertext, ephemeralPublicKey } = encryptedMessage;
  const recipientKey = curve.keyFromPrivate(recipientPrivateKey, "hex");
  const ephemeralKey = curve.keyFromPublic(ephemeralPublicKey, "hex");
  const sharedSecret = recipientKey.derive(ephemeralKey.getPublic());
  const sharedKey = CryptoJS.SHA256(sharedSecret.toString(16)).toString();
  const bytes = CryptoJS.AES.decrypt(ciphertext, sharedKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Function to create a post object
function createPost(
  content,
  hashtags = [],
  attachments = [],
  tags = [],
  parent = null
) {
  return { content, parent, hashtags, attachments, tags };
}

// Function to create meta object
function createMeta(name, about, image, website, followed = []) {
  return { followed, name, about, image, website };
}

// Function to create a commit
function createCommit(privateKey, data, type, difficulty = 3) {
  try {
    let nonce = 0;
    let messageHash;

    do {
      nonce++;
      messageHash = hashMsg(`${JSON.stringify(data)}${nonce}`);
    } while (
      !checkDifficulty(difficulty, messageHash) ||
      messageHash === undefined
    );

    const signature = signMsg(privateKey, messageHash);
    const publicKey = privToPub(privateKey);

    return { data, type, nonce, publicKey, signature };
  } catch (error) {
    console.error("Error creating commit:", error);
    throw new Error("Failed to create commit.");
  }
}

// Function to verify a commit
function verifyCommit(commit, difficulty = 3) {
  if (!checkObject(commit)) {
    return false;
  }

  const { data, nonce, publicKey, signature } = commit;
  const messageHash = hashMsg(`${JSON.stringify(data)}${nonce}`);
  const isValidSignature = verifySig(publicKey, messageHash, signature);
  const isValidDifficulty = checkDifficulty(difficulty, messageHash);
  return isValidSignature && isValidDifficulty;
}

// Function to verify object structure
function checkObject(dataObject) {
  const requiredProperties = [
    "data",
    "publicKey",
    "signature",
    "type",
    "nonce",
  ];

  for (const prop of requiredProperties) {
    if (!dataObject.hasOwnProperty(prop)) {
      return false;
    }
  }

  return validateData(dataObject.data, dataObject.type);
}

// Function to validate data structure
function validateData(data, type) {
  if (type === "post") {
    return (
      data.hasOwnProperty("parent") &&
      data.hasOwnProperty("content") &&
      data.hasOwnProperty("hashtags") &&
      data.hasOwnProperty("attachments") &&
      data.hasOwnProperty("tags") &&
      data.hashtags.every(
        (element) =>
          typeof element === "string" &&
          element.length <= 32 &&
          /^[a-zA-Z0-9]*$/.test(element)
      ) &&
      data.attachments.every(
        (element) =>
          element.hasOwnProperty("type") &&
          (element.type === "image" ||
            element.type === "video" ||
            element.type === "other") &&
          (element.hasOwnProperty("cid") || element.hasOwnProperty("url"))
      ) &&
      data.tags.every(
        (tag) =>
          tag.hasOwnProperty("key") &&
          tag.hasOwnProperty("value") &&
          typeof tag.key === "string" &&
          typeof tag.value === "string"
      )
    );
  }

  if (type === "meta") {
    return (
      data.hasOwnProperty("followed") &&
      data.hasOwnProperty("name") &&
      data.hasOwnProperty("about") &&
      data.hasOwnProperty("image") &&
      data.hasOwnProperty("website")
    );
  }

  if (type === "message") {
    return data.hasOwnProperty("receiver") && data.hasOwnProperty("message");
  }

  return false;
}

module.exports = {
  genKeys,
  privToPub,
  signMsg,
  verifySig,
  checkDifficulty,
  hashMsg,
  encryptMsg,
  decryptMsg,
  createPost,
  createMeta,
  createCommit,
  verifyCommit,
};
