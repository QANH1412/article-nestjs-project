# Deployment Guideline for Heucard Laravel Project

## 1. Download Source Code
Clone the repository or download the ZIP file:
```bash
git clone <repository-url>
cd <project-directory>
```

## 2. Configure Environment Variables
Copy the example `.env` file:
```bash
cp .env.example .env
```
Open `.env` and update the required configurations:
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=your_database_name
DB_USERNAME=root
DB_PASSWORD=your_password
```

## 3. Verify Docker Configuration
Ensure the `docker-compose.yml` file contains the correct settings:
```yaml
services:
    app:
        build:
            context: ./docker/php
        container_name: heucard_app
        volumes:
            - ./:/var/www
        working_dir: /var/www
        environment:
            - APP_ENV=local
            - APP_DEBUG=true
            - DB_CONNECTION=${DB_CONNECTION}
            - DB_HOST=${DB_HOST}
            - DB_PORT=${DB_PORT}
            - DB_DATABASE=${DB_DATABASE}
            - DB_USERNAME=${DB_USERNAME}
            - DB_PASSWORD=${DB_PASSWORD}
        depends_on:
            - mysql
        ports:
            - "9000:9000"

    mysql:
        image: mysql:8.0
        container_name: heucard_mysql
        restart: always
        environment:
            MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
            MYSQL_DATABASE: ${DB_DATABASE}
        volumes:
            - mysql_data:/var/lib/mysql
        ports:
            - "3307:3306"

    nginx:
        image: nginx:latest
        container_name: heucard_nginx
        ports:
            - "80:80"
            - "443:443"
        volumes:
            - ./:/var/www
            - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
            - ./certbot/conf:/etc/letsencrypt
            - ./certbot/www:/var/www/certbot
        depends_on:
            - app

    certbot:
        image: certbot/certbot
        container_name: heucard_certbot
        volumes:
            - ./certbot/conf:/etc/letsencrypt
            - ./certbot/www:/var/www/certbot
        entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h & wait $${!}; done'"

volumes:
    mysql_data:
```

## 4. Build and Start Containers
Run the following commands:
```bash
docker compose build
docker compose up -d
```

## 5. Verify MySQL Connection
- Open MySQL Workbench.
- Connect with `DB_USERNAME` and `DB_PASSWORD`.
- Use port `3307`.
- Check if the database `DB_DATABASE` exists. If not, create it manually.

## 6. Access Application Container
```bash
docker exec -it heucard_app bash
```

## 7. Generate Application Key
Inside the container, run:
```bash
php artisan key:generate
```
Check the `.env` file to ensure `APP_KEY` has been set.

## 8. Run Database Migrations
```bash
php artisan migrate
```
Verify the database tables in MySQL Workbench.

## 9. Generate OAuth Keys for Passport
```bash
php artisan passport:client --personal
```
- Set the client name as `HeuToken`.
- Refresh the database and verify `oauth_personal_access_clients` and `oauth_clients` tables.

Generate passport keys:
```bash
php artisan passport:keys
```
Check the `/storage` folder for `oauth-private.key` and `oauth-public.key`. Copy their content into `.env`:
```env
PASSPORT_PRIVATE_KEY="..."
PASSPORT_PUBLIC_KEY="..."
```

## 10. Start Laravel Server
```bash
php artisan serve
```
The PHP server is now running successfully.

