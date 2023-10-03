


# npm run build  
Remove-Item dist/fuse.zip
Set-Location dist
7z a fuse.zip fuse
Set-Location ..

scp .\dist\fuse.zip dev@54.177.168.159:/var/www/html 

ssh dev@54.177.168.159 "cd /var/www/html && rm -rf dist_bc && mv dist dist_bc && unzip fuse.zip && mv fuse dist && sudo chown -R dev:www-data dist && echo "$(date) - twafat/prod" >> log.log"
