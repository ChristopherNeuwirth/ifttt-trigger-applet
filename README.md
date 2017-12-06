# Schmatzfein Food

## Getting started

Install dependencies.
```
npm i
```

Rename `sample.env` to `.env`.

Rename `sample.ifttt.header.json` to `ifttt.header.json`.

Enter endpoint data to `.env` file, e.g.: _https://ifttt.com/services/gmail/applets/13371337/check_.
_APPIDDEV_ is for testing purpose, _APPIDPROD_ should contain the app id of your productive application.

Go to your applet on IFTTT and trigger it by the _Check Now_ button.
Watch for the request in the network tab of your browsers developer tools.
Copy it as curl and enter the header informations into your `ifttt.header.json` file.

Trigger app for productive:

```
npm run start
```

Trigger app for development:

```
npm run start:dev
```
