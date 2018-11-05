#!/bin/bash

source=/run/media/oleg/Backup/WERKVERZEICHNIS
target=/home/oleg/Documents/Panoptikum/pipeline/images

for dir in ${source}/WV_ab*/
do
    dir=${dir%*/}
    dir=${dir##*/}
    tgt="${target}/${dir}"
    mkdir -p "${tgt}"
    src="${source}/${dir}"
    echo "Converting from: ${src}"
    echo "Converting to: ${tgt}"
    cd "${src}"
    for file in ./*.jpg
    do
        fn=`basename "$file"`
        bn=${fn%.*}
        #echo "${fn} ${bn}"
        convert -verbose -resize "1920x1080>" "./${fn}" "${tgt}/${bn}.jpg"
    done
done
