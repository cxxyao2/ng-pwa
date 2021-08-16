# service worker: pwa and push notification

## test service worker should run the following command

- $ ng build --prod
- $ http-server -p 8080 -c-1 dist/your-project-name

## deploy a PWA project to github

- $ ng add angular-cli-ghpages
- $ ng deploy --base-href=https://....

## push notifications

- install web-push package globally
  - $ npm install web-push -g
- generate a VAPID key pair
  - $ web-push generate-vapid-keys --json
  - output: {"publicKey": "....", "privateKey":"..."}

## we will use the public Key and private key in frontend and backend applications.

## screenshots

- ask for user's admission to receive notifications

- ![allow Notification](https://github.com/cxxyao2/ng-pwa/blob/master/src/assets/allowNotification.png)
- send a notification from server side
- ![send notification](https://github.com/cxxyao2/ng-pwa/blob/master/src/assets/sendNotification.png)
- get notification through browser
- ![get notification](https://github.com/cxxyao2/ng-pwa/blob/master/src/assets/getNotification.png)
