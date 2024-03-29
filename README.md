# TokenVest
<a name="readme-top"></a>

<!--
HOW TO USE:
This is an example of how you may give instructions on setting up your project locally.

Modify this file to match your project and remove sections that don't apply.

REQUIRED SECTIONS:
- Table of Contents
- About the Project
  - Built With
  - Live Demo
- Getting Started
- Authors
- Future Features
- Contributing
- Show your support
- Acknowledgements
- License

OPTIONAL SECTIONS:
- FAQ

After you're finished please remove all the comments and instructions!
-->


<!-- TABLE OF CONTENTS -->

# 📗 Table of Contents

- [📖 About the Project](#about-project)
  - [🛠 Built With](#built-with)
    - [Tech Stack](#tech-stack)
    - [Key Features](#key-features)
 - [🚀 Live Demo](#live-demo)
- [💻 Getting Started](#getting-started)
- [👥 Authors](#authors)
- [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [❓ FAQ (OPTIONAL)](#faq)
- [📝 License](#license)

<!-- PROJECT DESCRIPTION -->

# 📖 TokenVest<a name="about-project"></a>

This project involves building a decentralized application (DApp) using Solidity and ether.js. The DApp allows organizations to register and create vesting schedules for ERC20 tokens. Admins can specify vesting periods for stakeholders like community members, investors, and founders. The project includes smart contracts for organization registration and stakeholder management, a user interface for wallet connection, and admin interfaces for organization registration and stakeholder details. Testing is recommended on a Testnet environment.
## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>
This Eccomerce DApp is built using the following technologies and libraries:

- **Next.js**: A React-based framework for building efficient and scalable web applications.
- **Solidity:** The programming language used for developing Ethereum smart contracts.
- **Hardhat** It is a development environment for Ethereum smart contracts, providing a flexible, efficient, and extensible toolkit for building and testing decentralized applications.
- **JavaScript (ES6+):** The programming language employed for crafting the application's logic.
- **CSS:** The styling language used for customizing the appearance of the application.
- **Babel:** A JavaScript compiler that converts modern JavaScript (ES6+) code into backward-compatible versions for browser support.
- **Webpack:** A module bundler that packages the JavaScript and CSS files for deployment.
- **ESLint:** A JavaScript linter used for static code analysis to ensure code quality and adherence to coding standards.
- **Git:** A version control system for tracking changes in the codebase and facilitating collaboration.
- **GitHub**: A web-based platform for hosting the project's Git repository and enabling code sharing and collaboration.
- **npm:** The package manager for installing and managing project dependencies.
- **VS Code:** A popular code editor with excellent support for JavaScript and React development.
<!-- Features -->

### Key Features <a name="key-features"></a>


1. **Organization Registration:**
- Solidity Contracts: Implementation of Solidity smart contracts to facilitate the registration of organizations.
- ERC20 Token Creation: Ability for organizations to register themselves and create a contract for an ERC20 token.
2. **Stakeholder Vesting:**
- Stakeholder Types: Functionality allowing organizations to specify different stakeholder types (e.g., community, investors) and their respective vesting periods.
- Timelock Mechanism: Implementation of a timelock feature for vesting periods.
3. **Address Whitelisting:**
- Whitelisting Process: Capability for organizations to whitelist addresses associated with specific stakeholders (e.g., founders, investors).
4. **Token Claiming:**
- Claiming Functionality: Ability for whitelisted addresses to claim their tokens after the designated vesting period.
5. **Frontend Connectivity:**
- Wallet Connection: Frontend page enabling users to connect their wallets for seamless interaction with the DApp.
- Admin Registration: Frontend interface for administrators to register their organizations and manage stakeholder details.
6. **Withdrawal Process::**
- User Withdrawal: Creation of a page allowing whitelisted users to initiate withdrawals after completing the vesting period.
- Admin Withdrawal: Exclusive capability for organization admins to perform withdrawals on behalf of stakeholders.
7. **Testnet Implementation:**
Testnet Usage: Recommendation and provision for testing the DApp on a testnet environment to ensure functionality and security.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Live Demo 
<br><br><a name="live-demo">[live link](https://token-vest.vercel.app/)</a>


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Installation and setup <a name="getting-started"></a>

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>


👤 **Author1**

- GitHub: [@githubhandle](https://github.com/Unleashedicon)
- Twitter: [@twitterhandle](https://twitter.com/KipkuruiKelvin3e)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/kelvin-kipkurui-7b50b8252/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- FUTURE FEATURES -->

## 🔭 Future Features <a name="future-features"></a>

1. [ ] **Enhanced User Profiles:**
Implement customizable user profiles where users can showcase their preferences, purchase history, and favorite products.
2. [ ] **Social Integration:**
Integrate social features allowing users to share their favorite products or purchases on social media platforms.
3. [ ] **Enhanced Search and Filtering:**
Develop advanced search and filtering options to help users find products more efficiently based on various criteria like price range, category, or seller ratings.
4. [ ] **Expanded Payment Options:**
Include multiple payment gateways beyond cryptocurrency, such as credit/debit card payments or integration with popular payment systems like PayPal.
5. [ ] **Internationalization and Localization:**
Enable multi-language support and currency conversion to cater to a wider global audience.
6. [ ] **User Reviews and Ratings:**
Introduce a rating system allowing buyers to leave reviews and ratings for products and sellers, enhancing trust and transparency.
7. [ ] **Live Customer Support:**
Implement live chat or support features to assist users in real-time with their queries or issues.
8. [ ] **Subscription or Membership Services:**
Offer subscription-based services or membership rewards for frequent buyers, providing incentives for customer loyalty.
9. [ ] **Advanced Analytics and Insights:**
Provide sellers with analytics tools to track product performance, customer behavior, and sales trends.
10. [ ] **Responsive Mobile Application:**
Develop a mobile application for your eCommerce platform to offer a seamless shopping experience on mobile devices.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- SUPPORT -->

## ⭐️ Show your support <a name="support"></a>


We are excited to present our simple React project, which is a great tool for learning the basics of web development. Your support will help us to continue to develop and improve this project, making it an even more valuable resource for those just getting started with web development

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGEMENTS -->

## 🙏 Acknowledgments <a name="acknowledgements"></a>

I would like to thank Alchemy University for inspiring me to start this project it has been really helpful and i cannot wait for my next project

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FAQ (optional) -->

## ❓ FAQ (OPTIONAL) <a name="faq"></a>

- **How do I set up and run this project on my local machine?**

  - In order to set up and run this project on your local machine, you will need to have a text editor and a web browser installed. Simply download or clone the project from the repository, open the HTML file in your text editor, and then run it in your web browser by opening it from your file explorer or by drag and drop to browser.

- **How can I customize and use this project for my own needs?**

  - The project is designed to be easily customizable. You can start by editing the HTML and CSS files to change the layout and design of the project to suit your needs. You can also add or remove elements, or change the text and images to reflect the content of your own website. You can use developer tools of your browser to inspect and modify the elements of the page on the fly. Keep in mind that this is a basic project and you may need to add additional functionality and styles to fully meet your needs. If you have any questions or need further guidance, feel free to refer to the documentation or reach out to the project's maintainers for assistance.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.


<p align="right">(<a href="#readme-top">back to top</a>)</p>
