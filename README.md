# The 404 Server Manger Backend

## .env

```
SQLITE_STORAGE_PATH=/Users/nickrodriguez/Documents/_databases/404serverManager
TEST="Ça marche!"
APP_NAME="ServerManager"
PROJECT_RESOURCES=/Users/nick/Documents/_project_resources/ServerManager
PORT=3000
SECRET_KEY=sudo_let_me_in
```

## Serialzier

`yarn add jsonwebtoken`

## SQLite adn Seqluelize

1. install: `npm install sequelize sqlite3`

2. create models/ with connection.js and models
3. connect to app.js

```js
const sequelize = require("./models/connection"); // Import connection
// Sync database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => console.error("Error creating database tables:", error));
```

4. Viewer app for .sqlite files: DB Browser for SQLite
   - brew install: `brew install --cask db-browser-for-sqlite`
