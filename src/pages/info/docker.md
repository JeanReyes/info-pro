---
layout: ../../layouts/LayoutMd.astro
title: Docker
author: Jean Reyes
description: instrucciones básicas de Docker
---
## Pro tips 
```sh 
docker container run -dp 80:80 docker/getting-started
docker run -dp 80:80 docker/getting-started
```
## 👀 Componentes 
`[image, container, volume, network]`
 <!-- 1. image
 2. container
 3. volume
 4. network -->

```sh 
 docker <comando> --help
 ```

## docker prod
```sh 
docker compose -f docker-compose.prod.yml up --build
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

 

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
[PDF](../public/pdfs/docker-cheat-sheet.pdf)
<iframe src="../public/pdfs/docker-cheat-sheet.pdf" width="100%" height="1000" style="border: none">
  Tu navegador no soporta iframes.
</iframe>
