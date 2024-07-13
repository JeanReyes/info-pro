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
sudo apt update sudo apt upgrade -y
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
sudo nano /etc/nginx/sites-available/chimbarongo
```
ej:
```text
    server {
        
        listen 80;
        server_name chimbarongo.nes-sgd.cl www.chimbarongo.nes-sgd.cl

        root /var/www/chimbarongo.nes-sgd.cl/
        index index.html;

        location / {
            try_files $uri $uri/ /html;
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
nginx nginx -s reload
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
```text
server {
    listen 80;
    server_name front.nes-sgd.cl front.docs.nes-sgd.cl;

    location / {
        proxy_pass http://localhost:3000;  # Asegúrate de que el puerto sea el correcto para tu aplicación
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
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

