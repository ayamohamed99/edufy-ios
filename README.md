Edufy for Teachers
===

Mobile app for E4E teachers

**App ID: com.entrepreware.Edufy_Teachers**

===

For production 

"Production":"104.198.175.198"

IOs:


ionic cordova emulate ios --livereload -c --target="iPhone-6s, 11.4"


open /Volumes/BOOTCAMP/Mostafa/Edufy/platforms/ios/Edufy.xcodeproj

<preference name="iosPersistentFileLocation" value="Library" />

<preference name="iosExtraFilesystems" value="library,library-nosync,documents,documents-nosync,cache,bundle,root" />



ANDROID:

ionic cordova build android --prod --release

ionic cordova build android --aot --minifyjs --minifycss --optimizejs --prod --release

keytool -genkey -v -keystore edufy_teachers.jks -keyalg RSA -keysize 2048 -validity 10000 -alias edufy_teachers


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore edufy_teachers.jks app-release-unsigned.apk edufy_teachers


PASSWORD : @Entrepreware123


zipalign -v 4 app-release-unsigned.apk 1.0.4-edufy_teachers.apk


apksigner verify 1.0.4-edufy_teachers.apk