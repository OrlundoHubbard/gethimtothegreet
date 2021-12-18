//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract GreeterPortal {
    uint256 totalGreetings;

    event NewGreet(address indexed from, uint256 timestamp, string message);

    struct Greet {
        address greeter;
        string message;
        uint256 timestamp;
    }

    Greet[] greetings;

    constructor() {
        console.log("I am a smart contract. POG.");
    }

    function greet(string memory _message) public {
        totalGreetings += 1;
        console.log("%s has waved!", msg.sender);

        greetings.push(Greet(msg.sender, _message, block.timestamp));

        emit NewGreet(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
    require(
        prizeAmount <= address(this).balance, 
        "Trying to withdraw more money than the contract has."
    );

    }

    

    function getAllGreetings() public view returns (Greet[] memory) {
        return greetings;
    }

    function getTotalGreetings() public view returns (uint256) {

        console.log("We have %d total greetings!", totalGreetings);
        return totalGreetings;
    }
}
