// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./Organisation_Registration.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";


interface OrganizationRegistrationInterface {
    function getTokenContractAddress(address organizationAddress) external view returns (address);
}
contract StakeholderManagement {
    OrganizationRegistration public organizationRegistrationContract;
    MyToken public tokenContract;
    address public owner;

    enum StakeholderType { Community, Investor, PresaleBuyer, Founder, Other }

    struct VestingSchedule {
        uint256 startTime;
        uint256 duration;
        uint256 endVestingTime;
        uint256 initialAmount;
        StakeholderType stakeholderType;
    }

    struct BeneficiaryDetails {
        address beneficiaryAddress;
        VestingSchedule vestingDetails;
    }

    mapping(address => mapping(address => bool)) public whitelistedAddresses;
    mapping(address => mapping(address => VestingSchedule)) public organizationVestingSchedules;
    mapping(address => BeneficiaryDetails[]) public organizationBeneficiaries;
    mapping(address => address[]) public organizationWhitelistedAddresses;

    event VestingScheduled(
        address indexed organization,
        address indexed beneficiary,
        uint256 startTime,
        uint256 duration,
        uint256 endVestingTime,
        uint256 initialAmount,
        StakeholderType stakeholderType
    );
    event Whitelisted(
        address indexed organization,
        address indexed beneficiary
    );

    constructor(address _organizationRegistrationContract) {
        owner = msg.sender;
        organizationRegistrationContract = OrganizationRegistration(_organizationRegistrationContract);
        address tokenContractAddress = organizationRegistrationContract.getTokenContractAddress(owner);
        tokenContract = MyToken(tokenContractAddress);
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

  

    modifier hasVestingSchedule(address beneficiaryAddress) {
        require(organizationVestingSchedules[owner][beneficiaryAddress].startTime != 0, "No vesting schedule found");
        _;
    }

    function addVestingSchedule(
        address _beneficiary,
        uint256 _startTime,
        uint256 _duration,
        uint256 _initialAmount,
        StakeholderType _stakeholderType
    ) external onlyOwner {
        require(_duration > 0, "Invalid duration");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(organizationVestingSchedules[msg.sender][_beneficiary].startTime == 0, "Schedule already exists");

        uint256 endVestingTime = _startTime + _duration;

        organizationVestingSchedules[msg.sender][_beneficiary] = VestingSchedule({
            startTime: _startTime,
            duration: _duration,
            endVestingTime: endVestingTime,
            initialAmount: _initialAmount,
            stakeholderType: _stakeholderType
        });

        organizationBeneficiaries[msg.sender].push(BeneficiaryDetails({
            beneficiaryAddress: _beneficiary,
            vestingDetails: organizationVestingSchedules[msg.sender][_beneficiary]
        }));

        emit VestingScheduled(msg.sender, _beneficiary, _startTime, _duration, endVestingTime, _initialAmount, _stakeholderType);
    }

   function whitelistAddress(address _beneficiary) external onlyOwner {
        require(_beneficiary != address(0), "Invalid address");
        whitelistedAddresses[msg.sender][_beneficiary] = true;
        organizationWhitelistedAddresses[msg.sender].push(_beneficiary);

        emit Whitelisted(msg.sender, _beneficiary);
    }

    function getWhitelistedAddresses(address _organizationAddress) external view returns (address[] memory) {
        return organizationWhitelistedAddresses[_organizationAddress];
    }

    function getVestingSchedules(address _organizationAddress) external view returns (BeneficiaryDetails[] memory) {
        return organizationBeneficiaries[_organizationAddress];
    }

    function getOrganizationAndVestingSchedules(address _beneficiaryAddress) external view returns (VestingSchedule memory) {
    return organizationVestingSchedules[owner][_beneficiaryAddress];
    }

    function isAddressWhitelisted(address _beneficiaryAddress) external view returns (bool) {
        return whitelistedAddresses[owner][_beneficiaryAddress];
    }
    
    function removeWhitelistedAddress(address _beneficiary) external onlyOwner {
        require(whitelistedAddresses[msg.sender][_beneficiary], "Address not whitelisted");
        
        for (uint256 i = 0; i < organizationWhitelistedAddresses[msg.sender].length; i++) {
            if (organizationWhitelistedAddresses[msg.sender][i] == _beneficiary) {
                organizationWhitelistedAddresses[msg.sender][i] = organizationWhitelistedAddresses[msg.sender][organizationWhitelistedAddresses[msg.sender].length - 1];
                organizationWhitelistedAddresses[msg.sender].pop();
                break;
            }
        }
        
        delete whitelistedAddresses[msg.sender][_beneficiary];
    }

    function removeBeneficiary(address _organizationAddress, address _beneficiary) external onlyOwner {
        require(organizationVestingSchedules[_organizationAddress][_beneficiary].startTime != 0, "No vesting schedule found for the beneficiary");
        
        for (uint256 i = 0; i < organizationBeneficiaries[_organizationAddress].length; i++) {
            if (organizationBeneficiaries[_organizationAddress][i].beneficiaryAddress == _beneficiary) {
                organizationBeneficiaries[_organizationAddress][i] = organizationBeneficiaries[_organizationAddress][organizationBeneficiaries[_organizationAddress].length - 1];
                organizationBeneficiaries[_organizationAddress].pop();
                break;
            }
        }
        
        delete organizationVestingSchedules[_organizationAddress][_beneficiary];
    }

    function claimableTokens(address beneficiaryAddress) external view hasVestingSchedule(beneficiaryAddress) returns (uint256) {
    require(msg.sender == owner || whitelistedAddresses[owner][beneficiaryAddress], "Not authorized to claim tokens");
    
    VestingSchedule storage vesting = organizationVestingSchedules[owner][beneficiaryAddress];
    require(block.timestamp >= vesting.endVestingTime, "Vesting period not ended");
    
    return calculateClaimableTokens(vesting.initialAmount, vesting.endVestingTime, vesting);
    }

    function calculateClaimableTokens(uint256 initialAmount, uint256 endVestingTime, VestingSchedule storage vesting) internal view returns (uint256) {
        if (block.timestamp >= endVestingTime) {
            return initialAmount;
        } else {
            uint256 timePassed = block.timestamp - vesting.startTime;
            uint256 totalVestingTime = vesting.duration;
            return (initialAmount * timePassed) / totalVestingTime;
        }
    }

}