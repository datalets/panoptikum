#!/bin/bash

for dir in images/WV_ab*/
do
    for file in ${dir}/*.jpg
    do
        fn=`basename "$file"`
        bn=${fn%.*}
        convert -verbose -resize "200x200^" -gravity center -crop "200x200+0+0" +repage "./${fn}" "${tgt}/${bn}.jpg"
    done
done
