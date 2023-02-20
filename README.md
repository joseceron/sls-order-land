# sls-order-land
 
# Description
 
This project is ment to manage orders requests based on microservices approach using IaC with Serverless Framework, database persistence with NoSQL DynamoDB and Cognito Authentication in order to allow client server communication.

 
#### Table of Contents
 
- [Server](#server)
	- [Installation](#installation)
	- [Quick Start](#quickstart)
	- [Server usage](#usageserver)
	- [Docker](#docker)
	- [Docs](#docs)
	- [What is included](#whatisincluded)
- [Frontend](#frontend)


 
# Server
 
#### Installation
- [Install nvm](https://github.com/nvm-sh/nvm) in order to use different versions of node

``` bash
# clone the repo
$ git https://github.com/joseceron/sls-order-land.git
 
# go into app's directory
$ cd sls-order-land
 
# use node version 16.14.0
$ nvm install 16.14.0
$ nvm use 16.14.0
 
# install app's dependencies
$ npm install
```
 
#### Quick Start
- Some importants commands to have in mind


``` bash
# deploy
$ sls deploy
 
# deploying locally
$  sls offline
# remove resources
$ sls remove
 
 
```

- This project has been configured with a NoSQL database deployed in a dynamoDB


#### Documentation and design
- View User stories and microservices decomposition Patter [here](https://docs.google.com/document/d/17US9n0AzMXV-0GSTbytjlHeqkyjb-Hi6akYvO47gBTU/edit?usp=sharing)
- View architecture design [here](https://drive.google.com/file/d/1cESAmuaYKPxEMVbmA5Wk96ZhH9Pk4aPo/view?usp=sharing) 
- Postman file [here](https://drive.google.com/file/d/1-2aS4Nrz84WGGBLfOZIoXY2lYsTp4fUD/view?usp=sharing)


 
#### What is included

Within the download you will find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You will see something like this:

```
sls-order-land
│
├── api/             # project root
│   ├── basket/       # basket microservice folder
│   ├── ordering/    # ordering microservice folder
│   ├── products/   # products microservice folder
│   ├── routes/        # server routes
│   └── authentica-google.js          # jwt, cognito handler
│   └── bridge.js        # SQS bridge event
│   └── sendEmail.js    # SES handler, email notification
│   └── util.js    # handling headers properties
│
├── test/             # tests functions
│
├── serverless.yml  # IaC config file
│
└── package.json   # dependencies and scripts
```


### Features and technologies
- IaC: infrastructure as Code with Serverless Framework with aws SDK
- Restful api
- Data persistance with NoSQL DynamoDB
- AWS services: lambda, apigateway, Event Bridge, Cognito, DynamoDB, DynamoDocument Client, S3, SNS, SQS, serverless offline
- moment: parse, validate, manipulate, and display dates and times in JavaScript.
- jwt


**Table of Contents**

[TOCM]

[TOC]



### Stack Tech.md

[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white&labelColor=101010)]()![IaC](https://img.shields.io/badge/-Serverless%20Framework-lightgrey)![AmazonDynamoDB](https://img.shields.io/badge/Amazon%20DynamoDB-4053D6?style=for-the-badge&logo=Amazon%20DynamoDB&logoColor=white)

