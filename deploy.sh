#!/bin/bash
# USERNAME=someUser
# HOSTS="host1 host2 host3"
# SCRIPT="pwd; ls"
# for HOSTNAME in ${HOSTS} ; do
#     ssh -l ${USERNAME} ${HOSTNAME} "${SCRIPT}"
# done

#TOFU APP1
ssh -tt alex@keke.tw << EOF
cd paiba
git pull origin alex
cd /home/alex/paiba/client
./init.sh
cd /home/alex/paiba/server
./init.sh
exit
EOF

#TOFU APP / NGINX
# ssh -tt alex@172.104.116.143 << EOF
# echo 'hi'
# exit
# EOF