pragma solidity ^0.5.0;

contract Medical {
    address private owner;
    string private medicalLocationHash;

    address public reader;
    address public writer;
    mapping(address => string) public canRead;
    mapping(address => bool) public canWrite;

    constructor() public {
        owner = tx.origin;
    }

    function Read() public returns (string memory) {
        // require(canRead[msg.sender] == true, "You do not have read permission");
        string memory addr = canRead[msg.sender];
        canRead[msg.sender] = "";
        return addr;
    }

    function Write(string memory locationHash) public {
        require(
            canWrite[msg.sender] == true,
            "You do not have write permission"
        );
        medicalLocationHash = locationHash;
        canWrite[msg.sender] = false;
    }

    function ReadPermission() public {
        reader = msg.sender;
    }

    function WritePermission() public {
        writer = msg.sender;
    }

    function GrantWritePermission() public {
        require(owner == msg.sender, "You can not grant write permission");
        require(writer != address(0), "No writer!");
        canWrite[writer] = true;
    }

    function GrantReadPermission(string memory encryptedLocationHash) public {
        require(owner == msg.sender, "You can not grant read permission");
        require(reader != address(0), "No reader!");
        canRead[reader] = encryptedLocationHash;
    }

    function CheckWritePermission() public view returns (bool) {
        return canWrite[msg.sender];
    }

    function CheckReadPermission() public view returns (string memory) {
        return canRead[msg.sender];
    }

    function viewLocationHash() public view returns (string memory) {
        return medicalLocationHash;
    }
}

// contract Adoption {
//     address[16] public adopters;

//     // Adopting a pet
//     function adopt(uint256 petId) public returns (uint256) {
//         require(petId >= 0 && petId <= 15);
//         adopters[petId] = msg.sender;
//         return petId;
//     }

//     // Retrieving the adopters
//     function getAdopters() public view returns (address[16] memory) {
//         return adopters;
//     }
// }
