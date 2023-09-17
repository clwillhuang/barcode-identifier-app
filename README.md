# Barrel

This is the website frontend for Barrel (Barcode Reference Library) tool hosted at the University of Toronto. Access website at [https://barrel.utsc.utoronto.ca/app](https://barrel.utsc.utoronto.ca/app).

Note that the repository is only the frontend portion of the website, and does not include all resources such as scripts and Docker files necessary for deployment.

## Quickstart

After cloning this repository please ensure that the link to the Barrel API that you want to consume is provided as the domain in the [src/url.js file](/src/url.js) file. Note that certain APIs may restrict cross-origin requests from other websites, so using existing APIs hosted by third-parties may not be functional. 

```
npm install
npm run start
```

## Deploying the static website to s3
The following assumes that the React project is located within the Windows Subsystem for Linux 2, with aws installed and configured.
[Instructions for installing AWS CLI are here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

```
# Build the static website
npm run build  
# (optional) Test build on local machine (run 'npm install -g serve' if serve not installed)
serve -s build 
# Upload/Sync with s3
aws s3 sync build/ s3://barcode-identifier
```

On AWS, you can go to S3 > barcode-identifier > properties > static website hosting > bucket website endpoint
