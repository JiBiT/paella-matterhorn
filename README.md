#Beuth: Paella Player for Opencast

Url der Beuthbox: [Beuthbox.de](http://beuthbox.de)
Url ohne Domain: [http://141.64.153.82:8080/paella/ui/index.html](http://141.64.153.82:8080/paella/ui/index.html)

Beispielvideo Dual-View: [FlimmeTV](http://141.64.153.82:8080/paella/ui/watch.html?id=e89f34a0-da96-49dd-95e8-65805c20e1ac)

Dieses Repository umfasst das komplette Opencast-Plugin Paella-Matterhorn. Der Player ist ein eigenständiges Projekt.
Die package.json zeigt auf dieses Repository: [https://github.com/dazlious/paella](https://github.com/dazlious/paella) und ist ein Fork des Paella-Players mit ein paar Anpassungen.

## Installation:
### Zum Bauen einer Version:
    
    cd /path/to/this/repository
    mvn clean install
    sudo scp target/paella-engage-ui-5.1.13.jar ikarus@141.64.153.82:~/

### Auf dem Opencast-Server:
    sudo rm -rf /opt/opencast/deploy/paella-engage-ui-*.jar
    sudo chown opencast ~/paella-engage-ui-5.1.13.jar
    sudo chgrp opencast ~/paella-engage-ui-5.1.13.jar
    sudo chmod +x ~/paella-engage-ui-5.1.13.jar
    sudo mv ~/paella-engage-ui-5.1.13.jar /opt/opencast/deploy/paella-engage-ui-5.1.13.jar
    sudo /opt/opencast/bin/stop-opencast
    sudo nohup /opt/opencast/bin/start-opencast

## HLS
Leider nicht verfügbar, da Opencast dieses Protokoll nicht unterstützt. Der Paella-Player hat diese Funktionalität aber bereits, sodass es nur von Opencast abhängt. Für Neuigkeiten zu dem Thema kann unter [https://github.com/polimediaupv/paella-matterhorn](Paella-Player) nachgeschaut werden.

## Einbindung verschiedener Qualitäten
Dieses Thema wird automatisch übernommen. Nachdem das Video bei Opencast veröffentlich ist, hat der Paella-Player ein Plugin (es.upv.paella.multipleQualitiesPlugin) um die transkodierten Qualitätsstufen einstellen zu können. Dies kann jeder Nutzer im Frontend während der Wiedergabe einstellen. Es ist nicht nötig irgendetwas einzustellen.
