name := """simple-play-websocket-server"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

import AssemblyKeys._

assemblySettings

mainClass in assembly := Some("play.core.server.ProdServerStart")

fullClasspath in assembly += Attributed.blank(PlayKeys.playPackageAssets.value)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  ws exclude("commons-logging","commons-logging"),
  "com.typesafe.play" %% "play-streams-experimental" % "2.4.2" exclude("commons-logging","commons-logging"),
  "com.softwaremill.reactivekafka" %% "reactive-kafka-core" % "0.8.2" exclude("commons-logging","commons-logging")
)

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator
