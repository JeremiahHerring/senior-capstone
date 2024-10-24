# **Senior Capstone Project**

Welcome to the Senior Capstone project! This document will guide you through the process of setting up, running, and testing the application.

## **Table of Contents**
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Linting the Code](#linting-the-code)
- [Troubleshooting](#troubleshooting)
- [Conclusion](#conclusion)

---

## **Prerequisites**

Make sure you have the following installed before proceeding:

1. **Node.js** (version 18 or later) - [Download here](https://nodejs.org/)
2. **npm** (Node Package Manager) - Usually included with Node.js
3. **Git** - [Download here](https://git-scm.com/)

Check the versions by running:

```bash
node -v
npm -v
git --version
```

---

## **Installation**

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/senior-capstone.git
```

2. **Navigate to the project directory:**

```bash
cd senior-capstone
```

3. **Install dependencies:**

```bash
npm install
```

---

## **Running the Application**

To start the application in development mode, run:

```bash
npm run dev
```

This will start the development server on `http://localhost:3000`. You can view the application in your browser and any changes to the code will reflect automatically.

### **Building for Production**

To build the project for production:

```bash
npm run build
```

After the build process, you can start the production server with:

```bash
npm run start
```

---

## **Running Tests**

This project supports two types of testing: **Unit Testing** with **Jest** and **End-to-End Testing** with **Cypress**.

### **1. Unit Testing with Jest**

Run unit tests using:

```bash
npm run test
```

To run tests in watch mode (automatically re-runs tests on file changes):

```bash
npm run test:watch
```

### **2. End-to-End Testing with Cypress**

Open the Cypress test runner:

```bash
npm run cypress:open
```

This will launch the Cypress interface where you can select and run end-to-end tests to simulate real user interactions.

---

## **Linting the Code**

To check your code for style and syntax issues, run:

```bash
npm run lint
```

This will flag any errors or inconsistencies in your code according to the ESLint configuration.

---

## **Troubleshooting**

### **1. Port 3000 in Use**

If you get an error stating port `3000` is already in use, run the development server on a different port:

```bash
next dev -p 3001
```

### **2. Dependency Installation Issues**

If you run into issues installing dependencies, make sure you are using an up-to-date version of **Node.js** and **npm**. You can also try deleting the `node_modules` folder and running `npm install` again.

### **3. Cypress or Jest Tests Failing**

If you experience issues with the tests, ensure:

- The application is running without errors.
- Dependencies for testing are installed.

Refer to the [Jest documentation](https://jestjs.io/docs/en/getting-started) or [Cypress documentation](https://docs.cypress.io/guides/overview/why-cypress) for additional help.

---

## **Conclusion**

You now have the project set up and running, with the ability to test and lint the code. If you encounter any further issues or have questions, feel free to raise an issue in the project's GitHub repository.

Happy coding!
