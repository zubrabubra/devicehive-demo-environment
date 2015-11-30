// Compile with:
// g++ -std=gnu++0x example-client-cpp11.cpp -o example-client-cpp11
#include "../../easywsclient/easywsclient.hpp"
//#include "easywsclient.cpp" // <-- include only if you don't want compile separately
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <memory>
#include <unistd.h>
#include <sstream>
#include <math.h>
#include <iomanip>


int main(int argc, char ** argv)
{
  
  if (argc == 1) {
    printf("dh-cli <number of forks> <server name> <port number> <url end point> <guid/name> <count> <state two chars> <county id> <total length> <offset from start> <period length> <min_temp> <max_temp>\n");
    return 1;
  }

  int forkCount = atoi(argv[1]);
  std::string url = std::string("ws://") + std::string(argv[2]) + std::string(":") + std::string(argv[3]) + std::string(argv[4]);
  
  int period_length = atoi(argv[9]);
  int offset = atoi(argv[10]);
  int ct_period_length = atoi(argv[11]);
  int min_temp = atoi(argv[12]);
  int max_temp = atoi(argv[13]);

  while (forkCount > 0) {
    forkCount--;
    pid_t pid = fork();
  
    if (pid == 0) {
      using easywsclient::WebSocket;

      std::unique_ptr<WebSocket> ws(WebSocket::from_url(url));
      assert(ws);
      //authenticate device
      ws->send("{'action': 'authenticate', 'accessKey': '1jwKgLYi/CdfBTI9KByfYxwyQ6HUIEfnGSgakdpFjgk='}");
      ws->poll(-1);
      ws->dispatch( [](const std::string & message) {
          printf(">>A>> %s\n", message.c_str());
        } );

      std::ostringstream uuid_buf;
      uuid_buf << argv[5] << forkCount;
      std::string deviceUuid = uuid_buf.str();

      std::ostringstream county_buf;
      county_buf << argv[8];
      std::string deviceCounty = county_buf.str();
      
      ws->send("{'action': 'device/save', 'deviceId': '"+deviceUuid+"', 'device': {'deviceGuid': '"+deviceUuid+"', 'name': '"+deviceUuid+"', 'deviceClass': { 'name': 'Rest Device from Authorized User', 'version': '1.0'}, 'network' : { 'name' : 'VirtualLed Sample Network' }, 'status' : 'online', 'data': {'jsonString': 'string'}, 'blocked': false}}");
      ws->poll(-1);

      for (int message_num = 0; message_num < atoi(argv[6]); message_num++) {
        std::ostringstream msg_buf;
	double v_temp = random() % 100 * 0.02 + min_temp;
	double v_press = random() % 10 * 0.01 + 746.0;
        int in_period = message_num % period_length;
        if (in_period > offset && in_period < offset + ct_period_length) {
		float xv = (in_period - offset - ct_period_length / 2 + 0.0) / ct_period_length / 2;
                v_press = xv;
		v_temp = (1.0d / sqrt(0.8d * 3.1415926d)) * (max_temp - min_temp) * ( exp( - xv * xv / 0.4d) ) + min_temp;
	}
	msg_buf << "{'action': 'notification/insert', 'deviceGuid': '" << deviceUuid << "', 'notification': { 'notification': 'notificationTemperaturePressure', 'parameters': { 'temp': ";
	msg_buf << std::fixed << std::setprecision(3) << v_temp << ", 'pressure': " << std::fixed << std::setprecision(2) << v_press <<", 'units': 'SI', 'county': " << deviceCounty << ", 'state': '" << argv[7] << "' } }}";
	//ws->send("{'action': 'notification/insert', 'deviceGuid': '"+deviceUuid+"', 'notification': { 'notification': 'notificationTemperaturePressure', 'parameters': { 'temp': 23.3, 'pressure': 764.0, 'units': 'SI', 'county': "+deviceCounty+", 'state': '"+argv[7]+"' } }}");
        ws->send(msg_buf.str());
	ws->poll(-1);
        ws->dispatch( [](const std::string & message) {
            printf(">>A>> %s\n", message.c_str());
        } );
        sleep(1);
      }

      sleep(10);
      return 0;
      /*
      ws->send("goodbye");
      ws->send("hello");
      while (ws->getReadyState() != WebSocket::CLOSED) {
        WebSocket::pointer wsp = &*ws; // <-- because a unique_ptr cannot be copied into a lambda
        ws->poll();
        ws->dispatch([wsp](const std::string & message) {
            printf(">>> %s\n", message.c_str());
            if (message == "world") { wsp->close(); }
        });
      }
      */
    }
  }
    // N.B. - unique_ptr will free the WebSocket instance upon return:
  return 0;
}
