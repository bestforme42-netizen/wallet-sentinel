export const PANIC_REVOKE_ABI = [
  {
    inputs: [
      {
        components: [
          { name: "token", type: "address" },
          { name: "spender", type: "address" },
        ],
        name: "targets",
        type: "tuple[]",
      },
    ],
    name: "batchAllowance",
    outputs: [{ name: "allowances", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "token", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "canRevoke",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "encodeRevoke",
    outputs: [
      { name: "target", type: "address" },
      { name: "data", type: "bytes" },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

export const BASESCAN_BASE = "https://sepolia.basescan.org";

export const PANIC_REVOKE_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
