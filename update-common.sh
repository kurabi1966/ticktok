cd common
npm run pub

cd .. && cd tickets
npm uninstall @zidny.net/common
npm install @zidny.net/common

cd .. && cd orders
npm uninstall @zidny.net/common
npm install @zidny.net/common

cd .. && cd auth
npm uninstall @zidny.net/common
npm install @zidny.net/common

cd .. && cd expiration
npm uninstall @zidny.net/common
npm install @zidny.net/common

cd .. && cd payments
npm uninstall @zidny.net/common
npm install @zidny.net/common

cd ..
