CXXFLAGS = -std=gnu++0x -Wall
LDLIBS = -lstdc++
.PHONY: all clean test
all: dh-cli
clean:
	-rm  dh-cli *.o
test:
	cd test; $(MAKE) test
testserver: node_modules
	node example-server.js
dh-cli: dh-cli.o ../../easywsclient/easywsclient.o
dh-cli.o: dh-cli.cpp ../../easywsclient/easywsclient.hpp
