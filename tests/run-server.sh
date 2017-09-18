#!/bin/bash
php -S localhost:8080 1>/dev/null 2>&1 &
pid=$!
cat /dev/null > kill-server.sh
echo "#!/bin/bash" >> kill-server.sh
echo "kill $pid" >> kill-server.sh
chmod 755 kill-server.sh

