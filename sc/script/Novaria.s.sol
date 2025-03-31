// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MockGTX} from "../src/mocks/MockGTX.sol";
import {Novaria} from "../src/Novaria.sol";

contract NovariaScript is Script {
    MockGTX public mockGTX;
    Novaria public novaria;

    function setUp() public {}

    function run() public {
        // vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        vm.startBroadcast(0x733a26696f28bf734bc106b3def0dc4dbd91e3fe577a59c01f3f3712f9181991);


        mockGTX = new MockGTX();
        novaria = new Novaria(
            0x95d256cdD7d0B8579538E98DFFc343e725a717Ec, // WBTC address
            0x49f49CfE89050a8F8E48d3A31E33a8e26Bc80D1d, // NOVAToken address
            0xF422Ef4e6512bfAd4B67b4e22d29C8a0bf5c052c   // MockGMX address
        );

        console.log("Novaria deployed to:", address(novaria));
        vm.stopBroadcast();
    }
}
