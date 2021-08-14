FROM httpd:2.4

RUN apt update && apt install -y libapache2-mod-auth-openidc && apt clean && rm -rf /var/lib/apt/lists/*

RUN echo "\nInclude conf/oidc.conf\nLoadModule auth_openidc_module /usr/lib/apache2/modules/mod_auth_openidc.so\n" >> /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule proxy_http_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule proxy_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
