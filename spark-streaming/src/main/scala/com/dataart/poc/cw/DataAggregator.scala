package com.dataart.poc.cw

import java.util.Properties

import _root_.kafka.producer.{Producer, KeyedMessage, ProducerConfig}
import com.lambdaworks.jacks.JacksMapper
import com.typesafe.scalalogging.slf4j.LazyLogging
import org.apache.spark._
import org.apache.spark.streaming._
import org.apache.spark.streaming.kafka._
import org.apache.spark.sql._

object DataAggregator  extends App with LazyLogging {


  val conf = new SparkConf().setMaster("local[2]").setAppName("TemperaturePressureMonitor")
  val sc = new SparkContext(conf)
  val sqlContext = new SQLContext(sc)
  val ssc = new StreamingContext(sc, Seconds(2))

  val zkUrl = "127.0.0.1:2181"
  val notificationName = sc.broadcast(s"notificationTemperaturePressure")

  val messages = KafkaUtils.createStream(ssc, zkUrl, "country-aggregator-group", Map("device_notification" -> 1))
  val msgs = messages.window(Seconds(30))

  val kafkaProducer = new KafkaProducer(List("127.0.0.1:9092"), "agg")

  case class ParsedNotification(deviceGuid: String, notification: String, timestamp: String, parameters: String)
  case class Notification(deviceGuid: String, timestamp: String, mac: String, uuid:String, value: Double)

  val parsedDeviceMessages = msgs.map(
    msg => JacksMapper.readValue[Map[String, Any]](msg._2)
  ).map(
    notificationMap => ParsedNotification(
      notificationMap.get("deviceGuid").get.asInstanceOf[String],
      notificationMap.get("notification").get.asInstanceOf[String],
      notificationMap.get("timestamp").get.asInstanceOf[String],
      notificationMap.get("parameters").get.asInstanceOf[Map[String, String]].getOrElse("jsonString", "{}"))
  ).filter(
    parsed => parsed.notification.equalsIgnoreCase(notificationName.value)
  ).map(
    nmap => (nmap.deviceGuid, nmap.timestamp, JacksMapper.readValue[Map[String, Any]](nmap.parameters))
  ).map(
    x => Notification(x._1, x._2.substring(11,19),
      x._3.get("mac").get.asInstanceOf[String],
      x._3.get("uuid").get.asInstanceOf[String],
      x._3.get("value").get.asInstanceOf[Double])
  )

  parsedDeviceMessages foreachRDD { rdd =>
    val producer = kafkaProducer
    rdd foreachPartition { part =>
      part.foreach(msg => producer.send(msg.deviceGuid.getBytes()))
    }
  }

  ssc.start()

  println("started, awaiting termination")
  ssc.awaitTermination()

  case class KafkaProducer( val brokers: List[String],
                            val topic: String) {

    @transient
    private lazy val producer = {
      val props = new Properties()
      props.put("metadata.broker.list", brokers.mkString(","))
      props.put("serializer.class", "kafka.serializer.DefaultEncoder")
      props.put("request.required.acks", "1")
      val config = new ProducerConfig(props)
      new Producer[String, Array[Byte]](config)
    }

    def send(message: Array[Byte]) {
      producer.send(new KeyedMessage(topic, message))
    }

  }

}
