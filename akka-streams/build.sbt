name := """simple-play-websocket-server"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

mainClass := Some("Hi")

libraryDependencies ++= Seq(
  ws,
  "com.typesafe.play" %% "play-streams-experimental" % "2.4.2",
  "com.softwaremill.reactivekafka" %% "reactive-kafka-core" % "0.8.2"
)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator
