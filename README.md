# Forza Motorsport Color Picker

A side project based off of the [Colour Creation Database]()

Shows a preview of a selected color, along with the HSB values:
![image](docs/assets/img/forza-colors.gif)

And converts hex codes to forza HSB codes:
![image](docs/assets/img/forza-colors-hexconvert.gif)


## Remix.js Stuff

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

This project uses prisma to connect to a Postgres database.  You can use the csv in `util/data` to build a database, then create a `.env.` file at the root of the project containing the following: 

```
DATABASE_URL="postgresql://your_db_username:your_db_password@localhost:5432/your_db_name?schema=public"
```

## Deployment

First, build your app for production:

```sh
npm run build
```P

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
