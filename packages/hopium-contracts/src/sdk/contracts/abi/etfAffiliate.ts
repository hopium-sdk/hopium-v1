export const etfAffiliateAbi = [
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
    name: "CodeAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "CodeNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyCode",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "AffiliateAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "AffiliateFeeTransfered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "AffiliateRemoved",
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
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "code",
            type: "string",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        internalType: "struct EtfAffiliate.Affiliate[]",
        name: "affiliates",
        type: "tuple[]",
      },
    ],
    name: "addAffiliates",
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
        internalType: "string",
        name: "code",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
    ],
    name: "emitFeeTransferredEvent",
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
        internalType: "string",
        name: "code",
        type: "string",
      },
    ],
    name: "getAffiliateOwner",
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
        internalType: "string[]",
        name: "codes",
        type: "string[]",
      },
    ],
    name: "removeAffiliates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
