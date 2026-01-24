// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/**
 * @title Simplified Semver for tutorial
 * @notice Simple contract to track semantic versioning
 */
contract Semver {
    string public version;

    // Simple function to convert uint to string for version numbers
    function toString(uint256 value) internal pure returns (string memory) {
        // This function handles numbers from 0 to 999 which is sufficient for versioning
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits -= 1;
            // casting to 'uint8' is safe
            // forge-lint: disable-next-line(unsafe-typecast)
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }

        return string(buffer);
    }

    constructor(uint256 major, uint256 minor, uint256 patch) {
        version = string(
            abi.encodePacked(
                toString(major),
                ".",
                toString(minor),
                ".",
                toString(patch)
            )
        );
    }
}
