#!/bin/bash

source=`pwd`/images
tgt=thumb

for dir in ${source}/WV_ab*/
do
    echo "Creating thumbnails in: ${dir}/${tgt}"
    cd "${dir}"
    mkdir -p "${tgt}"
    for file in ./*.jpg
    do
        fn=`basename "$file"`
        bn=${fn%.*}
        if [ ! -f "${tgt}/${bn}.jpg" ]
        then
            echo "Thumbnailing: ${tgt}/${bn}.jpg"
            convert -verbose -resize "200x200^" -gravity center -crop "200x200+0+0" +repage \
                "./${fn}" "${tgt}/${bn}.jpg"
        fi
    done
done
