# Barrel

This is the website frontend for Barrel (Barcode Reference Library) tool.

Note that the repository is only the frontend portion of the website, and does not include all resources such as scripts and Docker files necessary for deployment.

## Quickstart

Download node modules
```
npm install
```

Run development server
```
npm run start
```

## Build

Build, then copy files to the deployment environment:
```
npm run build
```

To specify a different env file:
```
# Uses .env.prodbuild file:
npm run build --mode prodbuild
```