cp code.editor.io.conf /etc/apache2/sites-available/

a2ensite code.editor.io.conf

systemctl reload apache2

echo '127.0.0.1 code.editor.io' >> /etc/hosts
