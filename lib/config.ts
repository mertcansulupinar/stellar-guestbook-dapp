// Stellar TestNet Configuration
export const STELLAR_CONFIG = {
  NETWORK: 'testnet' as const,
  RPC_URL: 'https://soroban-testnet.stellar.org',
  CONTRACT_ID: 'CD5HAABXEFWUTSQKYZI37SQBWU4BPRQL7Y6DWTB5SZLHNG52VIDJFYYM',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  EXPLORER_URL: 'https://stellar.expert/explorer/testnet'
};

// Check if we're using the real contract
export const IS_REAL_CONTRACT = true;

// Helper to get full explorer URLs
export const getExplorerUrls = (address: string) => ({
  account: `${STELLAR_CONFIG.EXPLORER_URL}/account/${address}`,
  contract: `${STELLAR_CONFIG.EXPLORER_URL}/contract/${STELLAR_CONFIG.CONTRACT_ID}`,
  transaction: (txHash: string) => `${STELLAR_CONFIG.EXPLORER_URL}/tx/${txHash}`
});
