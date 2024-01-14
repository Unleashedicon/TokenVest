// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract OrganizationRegistration {
    address public owner;
    MyToken private organizationToken;
    struct Organization {
        string orgName;
        address orgAddress;
        MyToken tokenContract;
    }

    mapping(address => Organization) public organizations;

    event OrganizationRegistered(string indexed orgName, address indexed orgAddress, address tokenContract);
    event OrganizationRemoved(string indexed orgName, address indexed orgAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address tokenContractAddress) {
        owner = msg.sender;
        organizationToken = MyToken(tokenContractAddress); // Adjust here

    }
    function registerOrganization(string memory _orgName, string memory _tokenName, string memory _tokenSymbol) external onlyOwner {
        require(organizations[msg.sender].orgAddress == address(0), "Organization already registered");

        MyToken newToken = new MyToken(_tokenName, _tokenSymbol, msg.sender);
        organizations[msg.sender] = Organization({
            orgName: _orgName,
            orgAddress: msg.sender,
            tokenContract: newToken
        });

        emit OrganizationRegistered(_orgName, msg.sender, address(newToken));
    }

    function removeOrganization(address organizationAddress) external onlyOwner {
        require(organizations[organizationAddress].orgAddress != address(0), "Organization not found");
        delete organizations[organizationAddress];
        emit OrganizationRemoved(organizations[msg.sender].orgName, msg.sender);
    }

    function getTokenContractAddress(address organizationAddress) external view returns (address) {
        return address(organizations[organizationAddress].tokenContract);
    }

    function getOrganizationDetails(address orgAddress) external view returns (string memory orgName, address organizationAddress, address tokenContract) {
        Organization storage org = organizations[orgAddress];
        require(org.orgAddress != address(0), "Organization not found");
        return (org.orgName, org.orgAddress, address(org.tokenContract));
    }

    function getTokenBalance(address organizationAddress) external view returns (uint256) {
        Organization storage org = organizations[organizationAddress];
        require(org.orgAddress != address(0), "Organization not found");
        
        return organizationToken.balanceOf(organizationAddress); // Adjust here
    }
}


contract MyToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _mint(initialOwner, 1000 * (10**18));
    }
}

