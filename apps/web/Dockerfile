FROM nginx:alpine
# Copy the build assets
COPY build/client /usr/share/nginx/html
# Copy our custom index.html (with correct JS filename) to the root
COPY build/client/index.html /usr/share/nginx/html/index.html
# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
