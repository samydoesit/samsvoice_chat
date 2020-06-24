# Sam`s Voice chat-test

Using Firebase, Vue 2.6.11 and Vue Compositon API

See [DEMO](https://voicesam-5c724.web.app).

## Project setup


```
npm install
```
Create a Firebase Project and get the API Credentials.

Edit .env.sample accordingly.
```
firebase init
cp .env.sample .env.local

firebase deploy --only hosting
```

Deploy /functions separately

```
cd functions
npm install
firebase deploy --only functions
```


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
