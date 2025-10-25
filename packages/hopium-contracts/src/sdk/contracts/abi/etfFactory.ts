export const etfFactoryAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_directory",
        type: "address",
      },
      {
        internalType: "address",
        name: "_wethAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "DuplicateToken",
    type: "error",
  },
  {
    inputs: [],
    name: "ETHSendFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyTicker",
    type: "error",
  },
  {
    inputs: [],
    name: "EtfExists",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientETH",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidId",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSeedAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "NoAssets",
    type: "error",
  },
  {
    inputs: [],
    name: "NoPoolFound",
    type: "error",
  },
  {
    inputs: [],
    name: "NotHundred",
    type: "error",
  },
  {
    inputs: [],
    name: "OverWeight",
    type: "error",
  },
  {
    inputs: [],
    name: "TickerExists",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroToken",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroWeight",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroWethUsdPrice",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBips",
                type: "uint16",
              },
            ],
            internalType: "struct Asset[]",
            name: "assets",
            type: "tuple[]",
          },
        ],
        indexed: false,
        internalType: "struct Etf",
        name: "etf",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "etfTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "etfVaultAddress",
        type: "address",
      },
    ],
    name: "EtfDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdValue",
        type: "uint256",
      },
    ],
    name: "PlatformFeeTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenAmount",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Storage.TokenBalance[]",
        name: "updatedBalances",
        type: "tuple[]",
      },
    ],
    name: "VaultBalanceChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "Directory",
    outputs: [
      {
        internalType: "contract IDirectory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH_ADDRESS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_directory",
        type: "address",
      },
    ],
    name: "changeDirectoryAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBips",
                type: "uint16",
              },
            ],
            internalType: "struct Asset[]",
            name: "assets",
            type: "tuple[]",
          },
        ],
        internalType: "struct Etf",
        name: "etf",
        type: "tuple",
      },
    ],
    name: "createEtf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "emitPlatformFeeTransferredEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "emitVaultBalanceEvent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_key",
        type: "string",
      },
    ],
    name: "fetchFromDirectory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "getEtfById",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBips",
                type: "uint16",
              },
            ],
            internalType: "struct Asset[]",
            name: "assets",
            type: "tuple[]",
          },
        ],
        internalType: "struct Etf",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "getEtfByIdAndAddresses",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBips",
                type: "uint16",
              },
            ],
            internalType: "struct Asset[]",
            name: "assets",
            type: "tuple[]",
          },
        ],
        internalType: "struct Etf",
        name: "etf",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "vaultAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "getEtfByIdAndVault",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            components: [
              {
                internalType: "address",
                name: "tokenAddress",
                type: "address",
              },
              {
                internalType: "uint16",
                name: "weightBips",
                type: "uint16",
              },
            ],
            internalType: "struct Asset[]",
            name: "assets",
            type: "tuple[]",
          },
        ],
        internalType: "struct Etf",
        name: "etf",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "vaultAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "getEtfTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "getEtfVaultAddress",
    outputs: [
      {
        internalType: "address",
        name: "vaultAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSeedPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
    ],
    name: "recoverAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
