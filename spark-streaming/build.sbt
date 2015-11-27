lazy val root = (project in file(".")).
  settings(
    name := "spark-playground",
    version := "0.1",
    scalaVersion := "2.10.5",

    jarName in assembly := "spark-playground.jar",
    assemblyOption in assembly := (assemblyOption in assembly).value.copy(includeScala = false),

    resolvers += "Cloudera" at "https://repository.cloudera.com/artifactory/libs-snapshot-local",

    libraryDependencies ++= Seq(
      "com.typesafe.scala-logging" %% "scala-logging-slf4j" % "2.1.2",
      "com.lambdaworks" %% "jacks" % "2.3.3",
	  
      "org.apache.spark" %% "spark-core" % "1.5.1" % "provided",
      "org.apache.spark" %% "spark-streaming" % "1.5.1",
      "org.apache.spark" %% "spark-sql" % "1.5.1",
      "org.apache.spark" %% "spark-streaming-kafka" % "1.5.1",
      "com.amazonaws" % "aws-java-sdk-s3" % "1.9.37",

    //kafka writer
      "org.cloudera.spark.streaming.kafka" % "spark-kafka-writer" % "0.1.0",
      
      "org.apache.hadoop" % "hadoop-aws" % "2.6.0"
        exclude("com.amazonaws", "aws-java-sdk") 
        exclude ("javax.servlet", "servlet-api") 
        exclude("commons-beanutils", "commons-beanutils")
        exclude("commons-beanutils", "commons-beanutils-core")
    ),

    EclipseKeys.withSource := true
  )
  
net.virtualvoid.sbt.graph.Plugin.graphSettings
