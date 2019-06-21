## 万印宝小程序

## 1 项目node包统一使用yarn管理

不使用npm ，不使用 cnpm

下载地址：https://yarnpkg.com/zh-Hant/


## 2 node-sass网络太慢解决办法

#### npm
npm :

npm config set registry http://registry.npm.taobao.org

yarn :

yarn config set registry http://registry.npm.taobao.org

#### 只指定node-sass的下载源：
npm：

npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
yarn：

yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass

然后可以正常使用npm或者yarn进行下载了~