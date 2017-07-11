module.exports = {
  bpl: {
    messagePrefix: '\x18Bpl Signed Message:\n',
    bip32: {
      public: 46090600, // base58 will have a prefix 'apub'
      private: 46089520 // base58Priv will have a prefix 'apriv'
    },
    pubKeyHash: 25, // Addresses will begin with 'A'
    wif: 170 // Network prefix for wif generation
  },
  testnet: {
    messagePrefix: '\x18Bpl Testnet Signed Message:\n',
    bip32: {
      public: 46090600,
      private: 46089520
    },
    pubKeyHash: 25, // Addresses will begin with 'a'
    wif: 170 // Network prefix for wif generation
  },
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    wif: 0x80
  }
}
