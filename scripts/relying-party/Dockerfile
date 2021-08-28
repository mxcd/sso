FROM httpd:2.4

ENV MOD_AUTH_OPENIDC_LINK=https://github.com/zmartzone/mod_auth_openidc/releases/download/v2.4.8.2/libapache2-mod-auth-openidc_2.4.8.2-1.buster+1_amd64.deb

RUN apt update && apt install -y libapache2-mod-auth-openidc nano curl wget htop && \
    apt clean

RUN wget ${MOD_AUTH_OPENIDC_LINK} -O mod_auth_openidc.deb && apt install ./mod_auth_openidc.deb

RUN echo "\nInclude conf/oidc.conf\nLoadModule auth_openidc_module /usr/lib/apache2/modules/mod_auth_openidc.so\n" >> /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule proxy_http_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN sed -i '/LoadModule proxy_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
