---
layout: ../../layouts/LayoutMd.astro
title: NGINX
author: Jean Reyes
description: instrucciones para configurar servidor
---

## Configuración nginx

## 👀 Login e instalar nginx

1. acceder por ssh a la IP del servidor 
```sh 
ssh root@your_droplet_ip
```
2. actualizar paquetes 
```sh 
sudo apt update -y
```
3. instalar nginx 
```sh 
sudo apt install nginx -y
```
4. y permitir trafico 
 ```sh 
 sudo ufw allow 'Nginx Full'
 ```

## 👀 Config nginx

1. crear archivo de configuración para nuevo sitio
```sh 
sudo nano /etc/nginx/sites-available/docs.nes-sgd.cl
```
ej:
```text
server {
    listen 80;
    server_name docs.nes-sgd.cl;

    root /var/www/docs.nes-sgd.cl;  # Apunta a un directorio, no a un archivo
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # Intenta servir el archivo index.html si no se encuentra la URI
    }
}
```

2. crear enlace simbolico del nuevo sitio 
```sh 
sudo ln -s /etc/nginx/sites-available/chimbarongo.nes-sgd.cl /etc/nginx/sites-enabled/
o
ln -s ../sites-available/docs.nes-sgd.cl .
```

3. recargar 
```sh 
sudo systemctl start nginx
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
sudo nginx -t
```

## 👀  Cargar nuevo sistio.

1. cd /var/www 
```sh 
mkdir chimbarongo.nes-sgd.cl
```

2. trasladar proyecto desde MI maquina: 
```sh 
scp -r /Users/jereyesal/Desktop/PROJECT/var:www/ASTRO/pro-info root@64.227.2.167:/var/www/docs.nes-sgd.cl
```

# 👀 Resumen del Proceso Completo
```text
    Estructura de directorios:
        /etc/nginx/nginx.conf
        /etc/nginx/sites-available/
        /etc/nginx/sites-enabled/
        /var/www/example.com
        /var/www/sub.example.com

    Configuración de archivos:
        nginx.conf incluye sites-enabled/*
        Archivos de configuración en sites-available/
        Enlaces simbólicos en sites-enabled/

    Pasos de configuración:
        Crear directorios y asignar permisos
        Crear archivos HTML de ejemplo
        Configurar archivos de sitios virtuales
        Habilitar los sitios mediante enlaces simbólicos
        Verificar y recargar Nginx
```

### SIEMPRE QUE SE AGREGUE UN NUEVO SITIO CON OTRO PUERTO ES IMPORTANTE VER EL FIREWALL

## 👀  Asociar registro DNS

1. tener acceso a en donde compraste el dominio `nic.cl`
2. En digitalOcean ir a networking y agregar dominio por defecto se agregarán los NS y estos ser registrados en nic.cl
3. Crear un nuevo registro para el dominio tipo A: @ 'para que sea el dominio raiz', y crear los subdominios correspondientes que debes tener configurados en tu droplet, ver pasos anteriores


## 👀  Instalar app en node

1. instalar node o mvn para isntalar diferentes versiones de node 
```sh
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  source ~/.bashrc
  nvm install --lts
```

2. copiar el directorio del proyecto siguiendo los pasos de **mas arriba** para copiar desde mi maquina al droplet `/var/www/example.com`,
    una vez se copian los archivos ejecutar en el proyecto `npm install`

3. ejecutar `npm run build`, para compilar la app,

4. actualizar archivos nginx.conf en 'sites-available', seguir pasos de arriba
```sh
v.1
server {
    listen 80;
    server_name docs.nes-sgd.cl;

    location / {
        proxy_pass http://localhost:4321;  # Asegúrate de que el puerto sea el correcto para tu aplicación
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

v.2 

```sh 
server {
    listen 4320;
    server_name _;

    location / {
        proxy_pass http://localhost:4321;  # Cambia 3000 por el puerto correcto de tu aplicación
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        send_timeout 60s;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```
## 👀 Opcional

5. opcional se puede instalar `npm install pm2 -g` para manejar reinicios
6. arrancar app `pm2 start npm --name "docs.nes-sgd.cl" -- run start`, debes etsar en la carpeta del proyecto

7. para que sistema arranque `pm2 startup`, el comando proporciona un path target: `sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root`
8. guardar estado actual `pm2 save`


## 👀 comando extra
1. eliminar archivo de droplet `sudo rm nombre_del_archivo`
2. eliminar archivo de pm2 `pm2 delete nombre_del_archivo`
3. restar nginx `sudo systemctl restart nginx`, pm2 `pm2 restart`

## CICD

dar permisos 
`chmod +x deploy.sh`
./deploy.sh

#!/bin/bash

# Define variables
APP_DIR="/var/www/docs.nes-sgd.cl/info-pro"
APP_NAME="docs.nes-sgd.cl"
REPO_BRANCH="master"

# Navega al directorio de la aplicación
cd $APP_DIR || { echo "Directory $APP_DIR not found. Exiting."; exit 1; }

# Actualiza el repositorio
echo "Updating repository..."
git pull origin $REPO_BRANCH || { echo "Failed to pull from repository. Exiting."; exit 1; }

# Instala dependencias
echo "Installing dependencies..."
npm install || { echo "npm install failed. Exiting."; exit 1; }

# Construye la aplicación
echo "Building application..."
npm run build || { echo "npm run build failed. Exiting."; exit 1; }

# Elimina el proceso PM2 si existe
if pm2 list | grep -q "$APP_NAME"; then
  echo "Deleting existing PM2 process $APP_NAME..."
  pm2 delete $APP_NAME || { echo "Failed to delete PM2 process. Exiting."; exit 1; }
fi

# Inicia o reinicia la aplicación con PM2
echo "Starting application with PM2..."
pm2 start npm --name "$APP_NAME" -- run start || { echo "Failed to start application with PM2. Exiting."; exit 1; }

# Guarda la configuración de PM2
echo "Saving PM2 configuration..."
pm2 save || { echo "Failed to save PM2 configuration. Exiting."; exit 1; }

# Configura PM2 para iniciar al arranque del sistema (solo una vez)
if [ ! -f "/etc/systemd/system/pm2-$USER.service" ]; then
  echo "Configuring PM2 to start on boot..."
  pm2 startup systemd -u $USER --hp /home/$USER || { echo "Failed to configure PM2 startup. Exiting."; exit 1; }
  sudo env PATH=$PATH:/home/$USER/.nvm/versions/node/$(node -v)/bin pm2 startup systemd -u $USER --hp /home/$USER || { echo "Failed to configure PM2 environment for startup. Exiting."; exit 1; }
fi

echo "Deployment completed successfully!"

# nginx proxy manager

version: '3.8'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80' # Public HTTP Port
      - '443:443' # Public HTTPS Port
      - '81:81' # Admin Web Port
    environment:
      # Mysql/Maria connection parameters:
      DB_MYSQL_HOST: "db"
      DB_MYSQL_PORT: 3306
      DB_MYSQL_USER: "npm"
      DB_MYSQL_PASSWORD: "npm"
      DB_MYSQL_NAME: "npm"
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
    depends_on:
      - db

  db:
    image: 'jc21/mariadb-aria:latest'
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: 'npm'
      MYSQL_DATABASE: 'npm'
      MYSQL_USER: 'npm'
      MYSQL_PASSWORD: 'npm'
      MARIADB_AUTO_UPGRADE: '1'
    volumes:
      - ./mysql:/var/lib/mysql

