to run L2 ERC20 token deploy script:

```
forge script script/CoffeeTokenL2Deployer.s.sol:CoffeeTokenL2Deployer --broadcast -vvvv --interactives 1 --sender <ADDRESS>
```

for verification run:

```
forge verify-contract <CONTRACT_ADDRESS> src/<path to contract>:<contract name> --chain-id <chain-id>
```

Tokens:

- L1 ERC20 CoffeeToken address: `0xaB95e0280eA9c3dCF906eecD4A40Cba079475307` (UUPS proxy)
- L2 CoffeeToken Superchain address: `0x567e771017e5f7dad7c2db3721b07b501cd7952c`

Bridges:

- L1 Standard Bridge OP - `0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1`
- L1 Standard Bridge BASE - `0xfd0Bf71F60660E2f608ed56e1659C450eB113120`
- L1 Standard Bridge WLD - `0xd7DF54b3989855eb66497301a4aAEc33Dbb3F8DE`
- L2 Standard Bridge - `0x4200000000000000000000000000000000000010`
- Superchain Bridge - `0x4200000000000000000000000000000000000028`
- L1 Sepolia Mailbox for OP/Sepolia - `0x30a3509D71dce399dD99DD520e31F5BAc3f27b44`
- L2 OP-Sepolia Mailbox for Sepolia - `0x05A6E4D7c43B085EAF158a21B0A85997E978C958`
