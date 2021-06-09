# Memory Motel App
[![Netlify Status](https://api.netlify.com/api/v1/badges/1cd8a8b1-4272-4003-8a94-e21b8a558921/deploy-status)](https://app.netlify.com/sites/mm-app/deploys)
<p align="center"><img align="center" style="width:320px" src="./.github/memory-motel.png"/></p><br/>

## Links

### Ressources
- 🛣 Memory Motel API Documentation: [memory-api.azurewebsites.net/docs](https://memory-api.azurewebsites.net/docs/)
- 📘 Nuxt Documentation: [nuxtjs.org](https://nuxtjs.org)
- 📘 Vue Documentation: [vuejs.org](https://vuejs.org)
- 🌟 Nuxt Ressources [awesome.nuxtjs.org](https://awesome.nuxtjs.org/)
- 🚦 Git workflow [Git flow cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)

### Main external packages
| Plugins                                                           | Description                                                                                                              | Version                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@nuxtjs/auth-next](https://github.com/nuxt-community/auth-module)| 🔑 Auth module                                                                                                           | [![version](https://img.shields.io/npm/v/@nuxtjs/auth-next?style=flat-square)](https://www.npmjs.com/package/@nuxtjs/auth-next)                   |
| [hammerjs](https://github.com/hammerjs/hammer.js/)                | 👉 Handle multi-touch gestures                                                                                           | [![version](https://img.shields.io/npm/v/hammerjs.svg?style=flat-square)](https://www.npmjs.com/package/hammerjs)                                 |
| [vue-lazyload](https://github.com/hilongjw/vue-lazyload)          | 🏞 Lazyload on medias                                                                                                    | [![version](https://img.shields.io/npm/v/vue-lazyload.svg?style=flat-square)](https://www.npmjs.com/package/vue-lazyload)                         |
| [dayjs](https://github.com/iamkun/dayjs)                          | ⏰ Immutable date-time                                                                                                   | [![version](https://img.shields.io/npm/v/dayjs.svg?style=flat-square)](https://www.npmjs.com/package/dayjs)                                       |


## Getting started
### Installation
⚠️ You first need to install Memory Motel API to run this project
Repository: [github.com/Hashs7/memory-api](https://github.com/Hashs7/memory-api)

```bash
# copy env variables and fill with dev values
cp .env.example .env

# install dependencies
yarn install

# serve with hot reload at localhost:3000
yarn dev
```

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


