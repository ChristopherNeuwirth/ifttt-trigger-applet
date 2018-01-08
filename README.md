# IFTTT Trigger Applet - with now Deployment

## Getting started

Install dependencies.
```
npm i
```

Rename `sample.env` to `.env`.

Enter endpoint data to `.env` file, e.g.: _https://ifttt.com/services/gmail/applets/13371337/check_.
_APPIDDEV_ is for testing purpose, _APPIDPROD_ should contain the app id of your productive application.

Go to your applet on IFTTT and trigger it by the _Check Now_ button.
Watch for the request in the network tab of your browsers developer tools.
Copy it as curl and enter the header informations into your `ifttt.header.json` file. 
The secret parts of your application (token, referer, cookie) are stored in your .env file.

Trigger app for productive:

```
npm run start
```

Trigger app for development:

```
npm run dev
```


## Now deployment 

Deploy
```
now --dotenv environment/.env --public
now scale [ID_GIVEN] 1

curl [ID_GIVEN]
```

Check Logs
```
now logs [ID_GIVEN] 
```

## Job Handling

Restart the Job
```
curl [ID_GIVEN] -H 'action: RESTART'
```

Receive Information about the Job
```
curl [ID_GIVEN] -H 'action: INFO'
```