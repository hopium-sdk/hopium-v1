export const etfTokenEventsAbi = [
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "etfTokenAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transferAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etfWethPrice",
        type: "uint256",
      },
    ],
    name: "EtfTokenTransfer",
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
        internalType: "uint256",
        name: "etfId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "fromAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "toAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "transferAmount",
        type: "uint256",
      },
    ],
    name: "emitTransferEvent",
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
] as const;
