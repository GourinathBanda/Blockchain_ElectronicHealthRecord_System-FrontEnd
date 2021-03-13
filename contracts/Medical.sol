pragma solidity ^0.5.0;

contract Medical {
    address private owner;
    string private medicalLocationHash;

    string public reader;
    string public writer;
    mapping(string => string) public readHash;
    mapping(string => bool) public canWrite;

    constructor() public {
        owner = tx.origin;
    }

    function RevokeRead(string memory username) public {
        readHash[username] = "";
    }

    function Write(string memory locationHash, string memory username) public {
        require(
            canWrite[username] == true,
            "You do not have write permission"
        );
        medicalLocationHash = locationHash;
        canWrite[username] = false;
    }

    function ReadPermission(string memory username) public {
        reader = username;
    }

    function WritePermission(string memory username) public {
        writer = username;
    }

    function GrantWritePermission() public {
        require(owner == msg.sender, "You can not grant write permission");
        require(bytes(writer).length != 0, "No writer!");
        canWrite[writer] = true;
        writer = "";
    }

    function GrantReadPermission(string memory encryptedLocationHash) public {
        require(owner == msg.sender, "You can not grant read permission");
        require(bytes(reader).length != 0, "No reader!");
        readHash[reader] = encryptedLocationHash;
        reader = "";
    }

    function CheckWritePermission(string memory username) public view returns (bool) {
        return canWrite[username];
    }

    function Read(string memory username) public view returns (string memory) {
        return readHash[username];
    }

    function ViewLocationHash() public view returns (string memory) {
        return medicalLocationHash;
    }

    function ViewReader() public view returns (string memory) {
        return reader;
    }

    function ViewWriter() public view returns (string memory) {
        return writer;
    }
}
