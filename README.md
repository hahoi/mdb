# mdb (mdb)

Mobile Data Bank

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
 quasar dev -m spa
```

###只更新指定 function，這樣會加快速度

```
firebase deploy --only functions:AdminUpdateUser
```

### 發佈

```bash
quasar build -m pwa
firebase deploy --only hosting:mdb123
```

###預覽

```
firebase hosting:channel:deploy modatabank
會產生臨時網址
 https://--.web.app [expires 2021-03-12 15:44:11]
```
