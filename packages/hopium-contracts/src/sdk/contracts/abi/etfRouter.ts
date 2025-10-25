export const etfRouterAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_directory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "DeltaError",
    type: "error",
  },
  {
    inputs: [],
    name: "ETHSendFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyArr",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientETH",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidBips",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPerc",
    type: "error",
  },
  {
    inputs: [],
    name: "NoMintedAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "SupplyZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TargetGtTvl",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroEtfPrice",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroReceiver",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroTvl",
    type: "error",
  },
  {
    inputs: [],
    name: "AFFILIATE_USER_DISCOUNT_PERC",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_SLIPPAGE_BIPS",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    name: "PLATFORM_FEE_BIPS",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "newSlippageBips",
        type: "uint32",
      },
    ],
    name: "changeDefaultSlippage",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint16",
        name: "newFeeBips",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "affUserDiscountPerc",
        type: "uint16",
      },
    ],
    name: "changePlatformFee",
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
    inputs: [],
    name: "isActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "string",
        name: "affiliateCode",
        type: "string",
      },
    ],
    name: "mintEtfTokens",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
    ],
    name: "rebalance",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "etfTokenAmount",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "string",
        name: "affiliateCode",
        type: "string",
      },
    ],
    name: "redeemEtfTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_active",
        type: "bool",
      },
    ],
    name: "setActive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;
