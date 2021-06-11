# Memory Motel App
<p align="center"><img align="center" style="width:300px" src="./.github/memory-motel.png"/></p><br/>
<p align="center">
    <a href="https://app.netlify.com/sites/mm-app/deploys"><img src="https://api.netlify.com/api/v1/badges/1cd8a8b1-4272-4003-8a94-e21b8a558921/deploy-status" alt="Deploy Status"></a>
</p>


## Links

### Resources
- 🛣 Memory Motel API Documentation: [memory-api.azurewebsites.net/docs](https://memory-api.azurewebsites.net/docs/)
- 📘 Nuxt Documentation: [nuxtjs.org](https://nuxtjs.org)
- 📘 Vue Documentation: [vuejs.org](https://vuejs.org)
- 🌟 Nuxt Resources [awesome.nuxtjs.org](https://awesome.nuxtjs.org/)
- 🚦 Git workflow [Git flow cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)

### Main external packages
| Plugins                                                                        | Description                                                                                                              | Version                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@nuxtjs/auth-next](https://github.com/nuxt-community/auth-module)             | 🔑 Auth module                                                                                                           | [![version](https://img.shields.io/npm/v/@nuxtjs/auth-next?style=flat-square)](https://www.npmjs.com/package/@nuxtjs/auth-next)                   |
| [@nuxtjs/router-extras](https://github.com/nuxt-community/router-extras-module)| 🛣 Router extended                                                                                                       | [![version](https://img.shields.io/npm/v/@nuxtjs/router-extras?style=flat-square)](https://www.npmjs.com/package/@nuxtjs/router-extras)           |
| [@nuxtjs/pwa](https://github.com/nuxt-community/pwa-module)                    | 📱 PWA module with workbox support                                                                                       | [![version](https://img.shields.io/npm/v/@nuxtjs/pwa?style=flat-square)](https://www.npmjs.com/package/@nuxtjs/pwa)                               |
| [@nuxtjs/axios](https://github.com/nuxt-community/axios-module)                | 🌐 Axios module for Nuxt                                                                                       | [![version](https://img.shields.io/npm/v/@nuxtjs/axios?style=flat-square)](https://npmjs.com/package/@nuxtjs/axios)                               |
| [hammerjs](https://github.com/hammerjs/hammer.js/)                             | 👉 Handle multi-touch gestures                                                                                           | [![version](https://img.shields.io/npm/v/hammerjs.svg?style=flat-square)](https://www.npmjs.com/package/hammerjs)                                 |
| [vue-lazyload](https://github.com/hilongjw/vue-lazyload)                       | 🏞 Lazyload on medias                                                                                                    | [![version](https://img.shields.io/npm/v/vue-lazyload.svg?style=flat-square)](https://www.npmjs.com/package/vue-lazyload)                         |
| [dayjs](https://github.com/iamkun/dayjs)                                       | ⏰ Immutable date-time                                                                                                   | [![version](https://img.shields.io/npm/v/dayjs.svg?style=flat-square)](https://www.npmjs.com/package/dayjs)                                       |
| [gsap](https://github.com/greensock/GSAP)                                      | 💃 Animation library                                                                                                   | [![version](https://img.shields.io/npm/v/gsap.svg?style=flat-square)](https://www.npmjs.com/package/gsap)                                       |


## Getting started
### Installation
⚠️ You first need to install Memory Motel API to run this project    
[github.com/Hashs7/memory-api](https://github.com/Hashs7/memory-api)

Enable getUserMedia on your navigator    
For Chrome go to: chrome://flags/#enable-experimental-web-platform-features

```bash
# copy env variables and fill with dev values
cp .env.example .env

# install dependencies
yarn install

# serve with hot reload at localhost:3000
yarn dev
```

### HTTPS Configuration
This project uses [mkcert](https://github.com/FiloSottile/mkcert) to generate SSL certificate.
Please refer to the [mkcert installation doc](https://github.com/FiloSottile/mkcert#installation) to install it on your machine.

1. Generate a local certificate in `/cert` folder, in root of project.
````bash
# Create and go in /cert
mkdir cert && cd cert

# Generate certificate
# Replace [localip] by your machine's ip in your local network (or static url on Mac)
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 [localip] ::1

# On MacOS, you can also use your local DNS (Settings -> Share). I.E. :
mkcert -key-file key.pem -cert-file cert.pem localhost 127.0.0.1 robin.local ::1
````
2. Install the certificate on your machine.
````bash
mkcert -install
````

3. Mobile connection :
  - Transfer the `cert/cert.pem` file on your mobile (i.e. via AirDrop)
  - For the certificates to be trusted on mobile devices, you will have 
    to install the root CA. It's the `rootCA.pem` file in the folder 
    printed by `mkcert -CAROOT`. 
    Also transfer it on your mobile.
  - Install both profiles on the device

4. Enjoy ! 🎉

### Lint code
```bash
# see lint errors and warnings
yarn lint

# fix errors and warnings automatically
yarn lint --fix
```

### Run for production
```bash
# build for production and launch server
yarn build
yarn start

# generate static project
yarn generate
```

## Workflow

```bash
# init git flow
git flow init
```

### Create feature

```bash
# init git flow
git checkout develop
git flow feature start my-feature-name
git flow feature publish my-feature-name
```

### Finish feature
```bash
git flow feature finish my-feature-name
```


