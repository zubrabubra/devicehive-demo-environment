#!/bin/bash

cd ..

rm RUNNING_PID

echo "============== Starting ZK ====================="
nohup ./kafka_2.10-0.8.2.2/bin/zookeeper-server-start.sh config/zookeeper.properties > zk.log &
tail zk.log
sleep 20

echo "============= Kafka ==========================="
nohup ./kafka_2.10-0.8.2.2/bin/kafka-server-start.sh config/server.properties > kfk.log &
sleep 20
tail kfk.log

echo "============ Deploy Spark Job ================"
nohup spark-1.5.1-bin-hadoop2.6/bin/spark-submit --master local --class com.dataart.poc.cw.DataAggregator ./usage-sample-map/spark-streaming/target/scala-2.10/streamer.jar /home/rafa/.ivy2/cache/org.apache.spark/spark-streaming-kafka_2.10/jars/spark-streaming-kafka_2.10-1.5.1.jar > spark-stream.log &
sleep 20
tail spark-stream.log

echo "=========== Akka-Streaming =================="
nohup java -jar -Dconfig.file=prod.conf -Dhttp.address=0.0.0.0 -Dhttp.port=9000 ./usage-sample-map/akka-streams/target/scala-2.11/simple-play-websocket-server-assembly-1.0-SNAPSHOT.jar > streams.log &
sleep 20
tail streams.log

echo "========== Device Hive Server =============="
nohup java -jar devicehive-java-server/target/devicehive-2.1.0-SNAPSHOT-boot.jar > dh.log &
sleep 30
tail dh.log

echo "Ready."
