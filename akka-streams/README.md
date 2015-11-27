* From project directory: **activator assembly**

* **java -jar -Dconfig.file=prod.conf -Dhttp.address=127.0.0.1 -Dhttp.port=9000 target\scala-2.11\simple-play-websocket-server-assembly-1.0-SNAPSHOT.jars**

* **prod.conf** contains Kafka parameters. Feel free to change it.