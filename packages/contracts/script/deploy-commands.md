to run L2 ERC20 token deploy script:
```
forge script script/CoffeeTokenL2Deployer.s.sol:CoffeeTokenL2Deployer --broadcast -vvvv --interactives 1 --sender <ADDRESS>
```

Tokens:
- L1 ERC20 CoffeeToken address: `0xaB95e0280eA9c3dCF906eecD4A40Cba079475307` (UUPS proxy)
- L2 CoffeeToken Superchain address: `0xA366D3D9F564FF49A0862448dE49cF3fbe512aF9`

Bridges:
- L1 Standard Bridge OP - `0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1`
- L1 Standard Bridge WLD - `0xd7DF54b3989855eb66497301a4aAEc33Dbb3F8DE`
- L2 Standard Bridge - `0x4200000000000000000000000000000000000010`
- Superchain Bridge - `0x4200000000000000000000000000000000000028`