#!/bin/bash

source=`pwd`/IMPORT
target=`pwd`/images

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
    for file in *.{jpg,JPG,jpeg,JPEG,png,PNG,tif,TIF,tiff,TIFF}
    do
        fn=`basename "$file"`
        bn=${fn%.*}
        if [ ! "${bn}" == "*" ]
        then
            # echo "${fn} ${bn}"
            if [ ! -f "${tgt}/${bn}.jpg" ]
            then
                echo "Converting: ${tgt}/${bn}.jpg"
                convert -verbose -resize "1920x1080>" "./${fn}" "${tgt}/${bn}.jpg"
            fi
        fi
    done
done
