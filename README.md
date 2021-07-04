# knowledge-king-front-end

## Build Setup

### Install Dependencies
```bash
$ yarn install
```

### Setup SSL Certificate (Optional)
For those who needs to serve https, there must have ssl cert to serve it.

You can generate a self-signed ssl cert by this command:
```bash
openssl req -x509 -new -nodes -sha256 -utf8 -days 3650 -newkey rsa:2048 -keyout ./certs/cert.key -out ./certs/cert.crt
```

### Serve
To serve with hot reload
```bash
$ yarn dev
```

To build for production and launch server
```bash
$ yarn build
$ yarn generate
$ yarn start
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).
