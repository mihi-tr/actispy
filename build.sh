mkdir build
mkdir release
for FILE in `cat build-files`; do
    cp -r $FILE build/
    done
cd build
zip -r ../release/package.zip *
