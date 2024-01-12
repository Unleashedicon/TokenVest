const { ethers } = require('hardhat');

async function main() {
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = await MyToken.deploy("TITANIC", "TITAN", "0x461d9eD7FE07F35F2ABC60C85ee8226446e855Aa");

    await token.deployed();

    console.log("OrganizationRegistration deployed to:", token.address);
    const OrganizationRegistration = await ethers.getContractFactory("OrganizationRegistration");
    const organizationRegistration = await OrganizationRegistration.deploy(token.address);

    await organizationRegistration.deployed();

    console.log("OrganizationRegistration deployed to:", organizationRegistration.address);

    const StakeholderManagement = await ethers.getContractFactory("StakeholderManagement");
    const stakeholderManagement = await StakeholderManagement.deploy(organizationRegistration.address);

    await stakeholderManagement.deployed();

    console.log("StakeholderManagement deployed to:", stakeholderManagement.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
