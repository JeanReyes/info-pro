---
layout: ../../layouts/LayoutMd.astro
title: Docker
author: Jean Reyes
description: instrucciones básicas de Docker
---

## Pro tips 
```sh 
docker ps
docker container ls -a
docker compose -f docker.compose.prod.yml up --build -d
docker container run -dp 80:80 docker/getting-started
```
## 👀 Componentes 
`[image, container, volume, network]`

```sh 
 docker <comando> --help
 ```

```sh 
docker buildx build --platform linux/amd64 -t jean1991/sgd-back:1.0.0 -f Dockerfile.prod . --push
```

### login en registro
```sh 
docker login registry.digitalocean.com
user, pass,: algunTokenXX colocarlo como usuario y pass
docker buildx build --platform linux/amd64 -t registry.digitalocean.com/nes-corp-registry/sgd-back:1.0.0 -f Dockerfile.prod --push .
```

## install docker in droplet
```sh 
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

## install docker compose 
```sh 
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```
