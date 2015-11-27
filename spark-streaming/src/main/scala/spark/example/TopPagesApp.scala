package spark.example

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import com.amazonaws.services.s3.AmazonS3Client
import com.typesafe.scalalogging.slf4j.LazyLogging

object TopPagesApp extends App with LazyLogging {

  // S3 configuration
  val s3Credentials = new DefaultAWSCredentialsProviderChain().getCredentials
  val s3Endpoint = "s3.amazonaws.com"
  val amplabS3Bucket = "big-data-benchmark"
  val dataSetName = "uservisits"
  val dataSetSize = "tiny"
  val amplabS3Path = s"pavlo/text/$dataSetSize/$dataSetName"
  val filesToLoad = 10
  
  // List S3 files to load
  val s3Files = s3ListChildren(amplabS3Bucket, amplabS3Path).take(filesToLoad).map(key => s"s3n://$amplabS3Bucket/$key")
  logger.info(s"There are ${s3Files.size} files on S3")

  // Configure Spark
  val conf = new SparkConf(true).setAppName(getClass.getSimpleName)
  val sc = new SparkContext(conf)
  val hadoopCfg = sc.hadoopConfiguration
  hadoopCfg.set("fs.s3n.impl", "org.apache.hadoop.fs.s3native.NativeS3FileSystem")
  hadoopCfg.set("fs.s3n.awsAccessKeyId", s3Credentials.getAWSAccessKeyId)
  hadoopCfg.set("fs.s3n.awsSecretAccessKey", s3Credentials.getAWSSecretKey)

  // Load files from S3
  val logRecords = sc.union(s3Files.map(sc.textFile(_)))
  
  
  // Transformations
  
  val splitedRecords = logRecords.map(_.split(","))
  
  val pagePopularityPairs = splitedRecords flatMap {
    case Array(
        sourceIP,
        destURL,
        visitDate,
        adRevenue,
        userAgent,
        countryCode,
        languageCode,
        searchWord,
        duration) =>   
      Some((destURL, Popularity(1, adRevenue.toDouble)))
    case unk =>
      logger.warn(s"Unable to parse record: '$unk'")
      None
  }

  val popularityByPage = pagePopularityPairs.reduceByKey(_ + _).persist()
  
  val topPagesByAdRevenue = popularityByPage.sortBy(_._2.revenue, ascending = false)
  
  val topPagesByVisits = popularityByPage.sortBy(_._2.visits, ascending = false)
  
  
  // Actions
  
  println(s"\n\nTotal pages processed: ${popularityByPage.count}") 
  
  println("\n\nTop-20 pages by Ad revenue:") 
  topPagesByAdRevenue.take(20).foreach(println(_))
  
  println("\n\nTop-20 pages by visits:")
  topPagesByVisits.take(20).foreach(println(_))
  

  
  
  case class Popularity(visits: Int, revenue: Double) {
    def +(other: Popularity) = 
      Popularity(visits + other.visits, revenue + other.revenue)
  }
  
  def s3ListChildren(bucket: String, path: String): List[String] = {
    import scala.collection.JavaConversions._
    
    val client = new AmazonS3Client(s3Credentials)
    client.setEndpoint(s3Endpoint)
    
    client
      .listObjects(bucket, path)
      .getObjectSummaries.toList
      .map(s => s.getKey)
      .filter(!_.contains("$folder$"))
  }
  
}