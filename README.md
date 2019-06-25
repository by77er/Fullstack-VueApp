# What is this repo?
This repository consists of two main parts:
- A `vue.js` application frontend 
- An `express.js` backend API

The frontend is driven by the backend's REST API, and the backend is largely an interface to a local `postgres` database.


## Running this yourself
Make sure postgres is installed. You may have to edit `router-app-backend/app.js` for your own credentials. 

You'll need to create a postgres db named `router_app` with a single table called `public.machines`.
```sql
CREATE DATABASE router_app
```
```sql
CREATE TABLE machines(
    id      SERIAL,
    name    TEXT,
    os      TEXT,
    cores   INTEGER,
    ram     INTEGER,
    running BOOLEAN
);
```

Once that's done, start two shells.

With the first, 
```shell
cd router-app-backend
node app.js
```
With the second, 
```shell
cd router-app
npm run dev
```