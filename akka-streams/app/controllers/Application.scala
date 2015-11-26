package controllers


import javax.inject.Inject
import _root_.kafka.serializer.StringDecoder
import akka.actor._
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.{Sink, Source}
import com.softwaremill.react.kafka.ConsumerProperties
import com.softwaremill.react.kafka.KafkaMessages._
import com.softwaremill.react.kafka.ReactiveKafka
import org.reactivestreams.{Subscriber, Publisher}
import play.api._
import play.api.libs.iteratee.{Concurrent, Enumerator, Iteratee}
import play.api.libs.streams.Streams
import play.api.libs.ws._
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global

class Application @Inject()(ws: WSClient) extends Controller {

  implicit val actorSystem = ActorSystem("ReactiveKafka")
  implicit val materializer = ActorMaterializer()

  val kafka = new ReactiveKafka()
  val publisher: Publisher[StringKafkaMessage] = kafka.consume(ConsumerProperties(
    zooKeeperHost = "localhost:2181",
    brokerList = "localhost:9093",
    topic ="test",
    groupId = "groupname",
    decoder = new StringDecoder()
  ))

  def notifications = WebSocket.using[String] {
    request =>
      Logger.info(s"notifications, client connected.")
      val outEnumerator = Streams.publisherToEnumerator(publisher).map(_.message())
      (Iteratee.ignore[String], outEnumerator)
  }

}
