This documentation is related to this two tutorials:

https://fireship.io/lessons/angular-universal-firebase/

https://codeible.com/view/videotutorial/XTwjaMmUAHuRPPCLUnbQ

# Begin Converting Your Angular App to SSR

To begin, open a new or existing Angular project in a code editor and add Angular Universal to the project. 

Run the following command to add the express engine to your Angular project:

```bash
ng add @nguniversal/express-engine
```

The command will create and update a couple of files in the project and that’s all you have to do. The application is now ready for Server-Side Rendering.

# Publishing the App to Firebase

To publish the project to Firebase, go the angular.json file and change the outputPath for the build.

Replace the project’s name with functions and then scroll down until you see the server property and do the same.

```bash
"build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/functions/browser",
            "index": "src/index.html",
            "main": "src/main.ts",
            ...
          }
```

```bash
"server": {
          "builder": "@angular-devkit/build-angular:server",
          "options": {
            "outputPath": "dist/functions/server",
            "main": "server.ts",
            "tsConfig": "tsconfig.server.json"
          },
```

By doing this, it’ll place our production files in a folder call `functions` when the project is built. 

Save the project, and in the terminal, use `npm run build:ssr` to build the project.

Once the project is built, you can see a folder call `dist`. Inside the dist folder is another folder call `functions`. And inside the functions folder are the production files.

Now locate the file call `server.ts`. This file is added to the project when you run the command to add Angular Universal. The code in this file is what the server will look at when generating the web pages. 

```typescript
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import express, { Express } from 'express';

export function app(): Express {
  const server = express();
  const distFolder = join(process.cwd(), "dist/functions/browser");
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}
```

Make sure to rebuild the Angular app with `npm run build:ssr`.

# Initializing Firebase Hosting

```bash
firebase init
```

Configure your hosting.

For the public directory, use the location of the browser folder and then configure as a single-page application.

Once Hosting is ready, initialize Cloud Functions. 

After in your `firebase.json` make sure to have these changes.

```bash
{
  "hosting": {
    "public": "dist/functions/browser",
     // ...
    "rewrites": [
      {
        "source": "**",
        "function": "ssr"
      }
    ]
  }
}
```

Go to the package.json file for the project and copy all the dependencies. 

Then go to the package.json file for Cloud Functions and add them to its dependencies.

# Cloud Functions package.json

```bash
"dependencies": {
    "firebase-admin": "^9.2.0",
    "firebase-functions": "^3.11.0",
    ...
    "@nguniversal/express-engine": "^11.2.1",
    ...,
    "express": "^4.15.2",
    ...,
    "zone.js": "^0.11.4"
},
```

Save the project and in the terminal, change to the Functions directory and install the packages.

```bash
npm i
```

# Copy the Angular App to the Function Environment

```bash
cd functions
npm i fs-extra
```

Create cp-angular.js file

```javascript
const fs = require('fs-extra');

(async() => {

    const src = '../dist';
    const copy = './dist';

    await fs.remove(copy);
    await fs.copy(src, copy);

})();
```

Update the build script to copy over your Angular files. In you `package.json``

```bash
{
  "name": "functions",
  "scripts": {
    "build": "node cp-angular && tsc"
  }
}
```

The function itself only needs to import the universal app into the current working directory. That’s why we need to copy it to the function’s environment.

So in your `functions/index.ts`

```typescript
const functions = require("firebase-functions");
const path = require("path");

const mainjs = require(path.join(process.cwd(), "dist", "functions", "server", "main"));
exports.ssr = functions.https.onRequest(mainjs.app());

```

You can test it by serving both the hosting and function simultaneously - the moment of truth…

```
cd functions
npm run build
firebase serve or firebase emulators:start
```

You should now be able to visit your server rendered site on localhost:5000.

If it looks good, deploy the app with a single command:

```
firebase deploy
```


Pro tip: when testing, make sure not to deploy your app with errors, or you'll end up with a sky-high bill!