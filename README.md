#Beuth: Paella Player for Opencast


## Scripts:
### On host system
    
    cd /path/to/this/repository
    mvn clean install
    sudo scp target/paella-engage-ui-5.1.13.jar ikarus@141.64.153.82:~/

### On remote system
    sudo rm -rf /opt/opencast/deploy/paella-engage-ui-*.jar
    sudo chown opencast ~/paella-engage-ui-5.1.13.jar
    sudo chgrp opencast ~/paella-engage-ui-5.1.13.jar
    sudo chmod +x ~/paella-engage-ui-5.1.13.jar
    sudo mv ~/paella-engage-ui-5.1.13.jar /opt/opencast/deploy/paella-engage-ui-5.1.13.jar
    sudo /opt/opencast/bin/stop-opencast
    sudo nohup /opt/opencast/bin/start-opencast
