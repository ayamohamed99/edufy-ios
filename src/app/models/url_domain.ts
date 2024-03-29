import { DOMAIN_URL } from 'src/environments/environment';

export class Url_domain {
  // DEV from mobile
  // static Domain = 'http://104.155.139.135:8080';

  // production from mobile
  // static Domain = 'http://104.198.175.198';

  // local from mobile
  // static Domain = 'http://192.168.1.10:9090';

  // for Proxy
  // static Domain = '';
  static Domain = DOMAIN_URL;
  Domain = Url_domain.Domain;

  // run with proxy
  // ionic serve -- --proxy-config ./proxy.conf.json


  // ionic cordova emulate ios --livereload -c --target="iPhone-6s, 12.0"
  // open /Volumes/BOOTCAMP/Mostafa/Edufy/platforms/ios/Edufy.xcodeproj
  // <preference name="iosPersistentFileLocation" value="Library" />
  // <preference name="iosExtraFilesystems" value="library,library-nosync,documents,documents-nosync,cache,bundle,root" />

  // ionic cordova build android --prod --release
  //ionic cordova build android --aot --minifyjs --minifycss --optimizejs --prod --release
  // keytool -genkey -v -keystore edufy_teachers.jks -keyalg RSA -keysize 2048 -validity 10000 -alias edufy_teachers
  // jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore edufy_teachers.jks app-release-unsigned.apk edufy_teachers
  // PASSWORD : @Entrepreware123
  // zipalign -v 4 app-release-unsigned.apk 1.0.12-edufy_teachers.apk
  // apksigner verify 1.0.12-edufy_teachers.apk
}
/*
ionic cordova prepare android
ionic cordova run android --live-reload
 */
