// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// Import the standard ERC20 implementation from OpenZeppelin
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Interfaces
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Semver} from "../utils/Semver.sol";
import {IERC7802} from "@interop-lib/interfaces/IERC7802.sol";

// Libraries
import {PredeployAddresses} from "@interop-lib/libraries/PredeployAddresses.sol";

/**
 * @title ILegacyMintableERC20
 * @notice Legacy interface for the StandardL2ERC20 contract.
 */
interface ILegacyMintableERC20 {
    function mint(address _to, uint256 _amount) external;

    function burn(address _from, uint256 _amount) external;

    function l1Token() external view returns (address);

    function l2Bridge() external view returns (address);
}

/**
 * @title IOptimismMintableERC20
 * @notice Interface for the OptimismMintableERC20 contract.
 */
interface IOptimismMintableERC20 {
    function remoteToken() external view returns (address);

    function bridge() external view returns (address);

    function mint(address _to, uint256 _amount) external;

    function burn(address _from, uint256 _amount) external;
}

contract CoffeeTokenL2 is
    IOptimismMintableERC20,
    ILegacyMintableERC20,
    ERC20,
    IERC7802,
    Semver,
    Ownable
{
    string public constant AUTHOR = "Nikita Kubarko";

    /// @notice Address of the corresponding token on the remote chain.
    address public immutable REMOTE_TOKEN;

    /// @notice Address of the StandardBridge on this network.
    address public immutable BRIDGE;

    /// @notice Emitted whenever tokens are minted for an account.
    /// @param account Address of the account tokens are being minted for.
    /// @param amount  Amount of tokens minted.
    event Mint(address indexed account, uint256 amount);

    /// @notice Emitted whenever tokens are burned from an account.
    /// @param account Address of the account tokens are being burned from.
    /// @param amount  Amount of tokens burned.
    event Burn(address indexed account, uint256 amount);

    /// @notice A modifier that only allows the bridge to call
    modifier onlyBridge() {
        require(
            msg.sender == BRIDGE,
            "CoffeeTokenL2: only bridge can call this function"
        );
        _;
    }

    /// @param _bridge      Address of the L2 standard bridge.
    /// @param _remoteToken Address of the corresponding L1 token.
    /// @param _name        ERC20 name.
    /// @param _symbol      ERC20 symbol.
    constructor(
        address _bridge,
        address _remoteToken,
        address _initialOwner,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) Semver(1, 0, 0) Ownable(_initialOwner) {
        REMOTE_TOKEN = _remoteToken;
        BRIDGE = _bridge;
    }

    // @notice Allows the StandardBridge on this network to mint tokens.
    /// @param _to     Address to mint tokens to.
    /// @param _amount Amount of tokens to mint.
    function mint(
        address _to,
        uint256 _amount
    )
        external
        virtual
        override(IOptimismMintableERC20, ILegacyMintableERC20)
        onlyBridge
    {
        _mint(_to, _amount);
        emit Mint(_to, _amount);
    }

    /// @notice Burns tokens from an account.
    /// @param _from   Address to burn tokens from.
    /// @param _amount Amount of tokens to burn.
    function burn(
        address _from,
        uint256 _amount
    )
        external
        virtual
        override(IOptimismMintableERC20, ILegacyMintableERC20)
        onlyBridge
    {
        _burn(_from, _amount);
        emit Burn(_from, _amount);
    }

    function crosschainMint(address _to, uint256 _amount) external override {
        require(
            msg.sender == PredeployAddresses.SUPERCHAIN_TOKEN_BRIDGE,
            "Unauthorized"
        );

        _mint(_to, _amount);

        emit CrosschainMint(_to, _amount, msg.sender);
    }

    function crosschainBurn(address _from, uint256 _amount) external override {
        require(
            msg.sender == PredeployAddresses.SUPERCHAIN_TOKEN_BRIDGE,
            "Unauthorized"
        );

        _burn(_from, _amount);

        emit CrosschainBurn(_from, _amount, msg.sender);
    }

    /// @notice ERC165 interface check function.
    /// @param _interfaceId Interface ID to check.
    /// @return Whether or not the interface is supported by this contract.
    function supportsInterface(
        bytes4 _interfaceId
    ) external pure virtual returns (bool) {
        bytes4 iface1 = type(IERC165).interfaceId;
        // Interface corresponding to the legacy L2StandardERC20
        bytes4 iface2 = type(ILegacyMintableERC20).interfaceId;
        // Interface corresponding to the updated OptimismMintableERC20
        bytes4 iface3 = type(IOptimismMintableERC20).interfaceId;
        return
            _interfaceId == iface1 ||
            _interfaceId == iface2 ||
            _interfaceId == iface3;
    }

    /// @notice Legacy getter for the remote token. Use REMOTE_TOKEN going forward.
    function l1Token() public view override returns (address) {
        return REMOTE_TOKEN;
    }

    /// @notice Legacy getter for the bridge. Use BRIDGE going forward.
    function l2Bridge() public view override returns (address) {
        return BRIDGE;
    }

    /// @notice Getter for REMOTE_TOKEN.
    function remoteToken() public view override returns (address) {
        return REMOTE_TOKEN;
    }

    /// @notice Getter for BRIDGE.
    function bridge() public view override returns (address) {
        return BRIDGE;
    }

    function getCoffee() public pure returns (string memory) {
        return "Coffee L2";
    }
}
