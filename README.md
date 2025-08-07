# SavingForFuture project

## Description

A platform for saving for future starting from few money

## Project setup

- Clone the project repository

```bash
$ git clone https://github.com/mwizerwa77/savingforfuture-backend.git
```

- Navigate the project folder

```bash
$ cd savingforfuture-backend
```

- Set environment variables

```bash
DATABASE_URL=<your db_url>
DATABASE_HOST=<your db_hostname>
DATABASE_PORT=<your db_port>
DATABASE_NAME=<your database name>
DATABASE_USER=<your database user>
DATABASE_PASSWORD=<your database password>
PORT=<your application listening port>
JWT_SECRET=<signing jwt secret>
FRONTEND_BASE_URL=<client url>
EMAIL_HOST=<email hostname>
EMAIL_PORT=<email port>
EMAIL_SECURE=<whether to initiate communication with ssl/tls>
EMAIL_FROM=<Sender email address>
GMAIL_SERVICE_AUTH_EMAIL=<aunthenticated email address>
GMAIL_SERVICE_AUTH_APP_PASSWORD=<email app password>
COMPANY_ADMIN_PASSWORD=<secure admin password>
COMPANY_ADMIN_NATIONAL_ID=<nationalId of company admin>
COMPANY_ADMIN_AVATAR_URL=<cloudinary secure url of the profile_photo>
COMPANY_ADMIN_AVATAR_PUBLIC_ID=<cloudinary publicId of profile_photo>
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_SECRET=<api secret>
CLOUDINARY_API_KEY=<api key>
DEFAULT_USER_PASSWORD=<default password>
```

- Install required dependencies

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
