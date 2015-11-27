lazy val root = (project in file(".")).
  settings(
    name := "spark-playground",
    version := "0.1",
    scalaVersion := "2.10.5",

    jarName in assembly := "streamer.jar",
    assemblyOption in assembly := (assemblyOption in assembly).value.copy(includeScala = false),

    libraryDependencies ++= Seq(
      "com.typesafe.scala-logging" %% "scala-logging-slf4j" % "2.1.2",
      "com.lambdaworks" %% "jacks" % "2.3.3",
	  
      "org.apache.spark" %% "spark-core" % "1.5.1" % "provided",
      "org.apache.spark" %% "spark-streaming" % "1.5.1" % "provided",
      "org.apache.spark" %% "spark-sql" % "1.5.1" % "provided",
      "org.apache.spark" %% "spark-streaming-kafka" % "1.5.1" % "provided",
      "com.amazonaws" % "aws-java-sdk-s3" % "1.9.37",

      "org.apache.hadoop" % "hadoop-aws" % "2.6.0"
        exclude("com.amazonaws", "aws-java-sdk") 
        exclude ("javax.servlet", "servlet-api") 
        exclude("commons-beanutils", "commons-beanutils")
        exclude("commons-beanutils", "commons-beanutils-core")
    ),

    EclipseKeys.withSource := true
  )
  
net.virtualvoid.sbt.graph.Plugin.graphSettings
