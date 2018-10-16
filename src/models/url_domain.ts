
export class Url_domain{
  // DEV:any;
  // PRODUCTION:"http://104.198.175.198";
  // LOCAL:"http://192.168.1.10:8080";

  static Domain = "http://104.198.175.198";
  Domain = Url_domain.Domain;


  //      proxy
  // "proxies": [
  //   {
  //     "path":"/oauth",
  //     "proxyUrl": "http://104.198.175.198/oauth"
  //   },
  //   {
  //     "path":"/authentication",
  //     "proxyUrl": "http://104.198.175.198/authentication"
  //   }
  //   ],
  // "Production":"104.198.175.198"
  // ionic cordova emulate ios --livereload -c --target="iPhone-6s, 11.4"
  // open /Volumes/BOOTCAMP/Mostafa/Edufy/platforms/ios/Edufy.xcodeproj
  // <preference name="iosPersistentFileLocation" value="Library" />
  // <preference name="iosExtraFilesystems" value="library,library-nosync,documents,documents-nosync,cache,bundle,root" />

  // keytool -genkey -v -keystore edufy_teachers.jks -keyalg RSA -keysize 2048 -validity 10000 -alias edufy_teachers
  // jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore edufy_teachers.jks app-release-unsigned.apk edufy_teachers
  //PASSWORD : @Entrepreware123
  //zipalign -v 4 app-release-unsigned.apk 1.0.4-edufy_teachers.apk
  //apksigner verify 1.0.4-edufy_teachers.apk
}
