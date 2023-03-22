<div align="center">
  <a href="" rel="noopener">
 <!-- <img width=200px height=200px src="./public/icons/icon.svg" alt="Project logo"></a> -->
</div>

<div align='center'>
  <h1>NextJS Quick Start Boilerplate</h1>
</div>

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)

</div>

---

<p align="center">This boilerplate will help you get started faster with everything setup already.</p>
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Prerequisites](#prerequisites)
- [Development](#deployment)
- [Deployment](#deployment)
- [Usage](#usage)
- [Authors](#authors)

## 📖 About

This NextJS Boilerplate provides a simplified experience for building a NextJS Application with pre-built components, hooks, providers and TailwindCSS already available for you out of the box.

## 🏁 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the application on a live system.

## ✅ Prerequisites

What things you need to install the software and how to install them.

```
- NodeJS 16
- Yarn

or

- Docker
```

## 🚧 Development

```
- yarn install
- yarn dev
```

## 🚀 Deployment

### Using Yarn

````
pm2 start yarn --name "app" -- start
````

### Using Docker

````
INSTALL DOCKER
- https://docs.docker.com/get-docker/

BUILD & RUN
- docker build -t nextjs-app .
- docker run --name nextjs-app -p 3000:3000 --restart always -d nextjs-app

START ALREADY BUILT CONTAINER
- docker start nextjs-app

RELOAD WITH UPDATED FILES
- docker restart nextjs-app

AUTO START DOCKER DAEMON ON SYSTEM STARTUP
- sudo systemctl enable docker --now
````

## ✍️ Authors

- [@mrsanta79](https://github.com/mrsanta79)