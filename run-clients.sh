#!/bin/bash

cd ./ws-client/

declare -a arr=("ME" "MA" "RI" "NH" "VT" "CT" "NY" "NJ" "DE" "MD" "PA" "VA" "NC" "SC" "WV" "OH" "FL" "GA" "MI" "KY" "IN" "AL" "TN" "WI" "IL" "MS" "LA" "MO" "AR" "MN" "IA" "KS" "NE" "OK" "TX" "SD" "ND" "WY" "CO" "NM" "UT" "MT" "AZ" "ID" "NV" "CA" "WA" "OR" "AK" "HI")
position=0
for i in "${arr[@]}"
do
    number=$RANDOM
	let "position=$position+$number%3"
    echo "$i" 
    echo "ps = $position"
    echo "nm = $number"
    ./dh-cli 5 127.0.0.1 8080 /dh/websocket/device abc-01 180 $i 3 120 $position 30 22 45 > ../../logs/dh.$i.log &
    pause 1
done

