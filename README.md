# barcode-identifier-app

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
