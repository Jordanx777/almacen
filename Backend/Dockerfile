FROM php:8.2-apache

# Instalar extensiones PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configurar Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite

# Habilitar CORS para Angular
RUN echo '<IfModule mod_headers.c>' >> /etc/apache2/apache2.conf && \
    echo '    Header set Access-Control-Allow-Origin "http://localhost:4200"' >> /etc/apache2/apache2.conf && \
    echo '    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"' >> /etc/apache2/apache2.conf && \
    echo '    Header set Access-Control-Allow-Headers "Content-Type, Authorization"' >> /etc/apache2/apache2.conf && \
    echo '</IfModule>' >> /etc/apache2/apache2.conf

RUN a2enmod headers

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html

WORKDIR /var/www/html