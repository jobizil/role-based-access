# role-based-access
This is a role based system that helps you manage different users on the system.
 
---
This is a Role Based Access Control application using Nodejs, Express, Passport Js, etc.
You can use this application as the starting point for whatever project you are going to build which needs authentication and authorization.

For authentication we have only Email & Password option but other authentication options using OAuth/OAuth2.0 like Google, Facebook, Apple, GitHub, etc, can be easily incorporated.

The application is based on the **MVC pattern** i.e. Model View Controller.

**Mongoose** is used as an ORM for MongoDB for storing Users in Database.

**Passport JS** is used for local(email, password) authentication.

The application is **production ready**.

---

## To start setting up the project

Step 1: Clone the repo

```bash
git clone https://github.com/jobizil/role-based-access.git
```

Step 2: cd into the cloned repo and run:

```bash
yarn install
```

Step 3: Put your credentials in the .env file.

```bash
PORT=2030
MONGODB_URI=mongodb://localhost:27017/role_based_access
```

Step 4: Start the app by

```bash
yarn dev
```
 
