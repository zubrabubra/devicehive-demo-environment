#!/bin/sh

set -e

echo "Installing Oracle Java 8"

sudo apt-add-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer

echo "Installing core apps."

sudo apt-get install make postgresql nginx gcc g++ git tar gzip curl

cd ..

sudo -u postgres psql -U postgres -d postgres -c "alter user postgres with password '12345';"
sudo -u postgres createdb mydb

echo "Downloading Components"
curl http://www.us.apache.org/dist/kafka/0.8.2.2/kafka_2.10-0.8.2.2.tgz | gunzip > kafka_2.10-0.8.2.2.tar
tar xvf kafka_2.10-0.8.2.2.tar

curl http://www.us.apache.org/dist/spark/spark-1.5.2/spark-1.5.2-bin-hadoop2.6.tgz | gunzip > spark-1.5.2-bin-hadoop2.6.tar
tar xvf spark-1.5.2-bin-hadoop2.6.tar

echo "Installing EasyWsClient"
git clone https://github.com/dhbaird/easywsclient.git
git clone https://github.com/devicehive/devicehive-java-server.git

curl http://www.eu.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz | gunzip > apache-maven-3.3.9-bin.tar
tar xvf apache-maven-3.3.9-bin.tar

echo "Building DeviceHive Java Server"
cd devicehive-java-server
../apache-maven-3.3.9/bin/mvn clean install
cd ../devicehive-demo-environment

cd akka-streams
./activator assembly

cd ../ws-client
make

cd ../spark-streaming
./activator assembly

cd ../web-page
sudo cp * /usr/share/nginx/html/
