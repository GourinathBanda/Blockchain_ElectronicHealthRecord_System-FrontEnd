pragma solidity >=0.4.21 <0.7.0;

contract Test {
    address public reader;
    address public writer;
    address private canWrite;
    address private canRead;
    address private owner;
    string private medicalLocationHash;

    constructor() public {
        owner = tx.origin;
    }

    function test() public pure returns (uint) {
        return 1337;
    }

    function StoreLocationHash(string memory locationHash)
        public
        returns (string memory)
    {
        if (msg.sender == canWrite) {
            medicalLocationHash = locationHash;
            return "Data written successfully";
        }
        return "Permission Denied";
    }

    function Read() public view returns (string memory) {
        return medicalLocationHash;
    }

    function ReadPermission() public returns (address) {
        reader = msg.sender;
        return reader;
    }

    function WritePermission() public returns (address) {
        writer = msg.sender;
        return writer;
    }

    function GrantWritePermission() public returns (string memory) {
        if (owner == msg.sender && writer != address(0)) {
            canWrite = writer;
            return "Write Permission Granted";
        }
        return "Permission Denied";
    }

    // function GrantReadPermission() public returns (string memory) {
    //     if (owner == msg.sender && reader != address(0)) {
    //         canRead = reader;
    //         return "Permission Granted";
    //     }
    //     return "Permission Denied";
    // }
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
