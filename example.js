const {
  generateKeyPair,
  privateKeyToPublicKey,
  signMessage,
  verifySignature,
  difficultyverify,
  hashMessage,
  encryptMessageWithPublicKey,
  decryptMessageWithPrivateKey,
  postTemplate,
  metaTemplate,
  createCommit,
  verifyCommit,
} = require("./index");

async function main() {
  const { privateKey, publicKey } = generateKeyPair();

  const message = "Hey Sir how are you doing today?";

  const msgtoSend = encryptMessageWithPublicKey(message, publicKey);

  const cmt = createCommit(privateKey, msgtoSend, "message", 3);

  console.log(cmt);
}

main();
