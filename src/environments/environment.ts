// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Collabtic Firebase Config
  var fcmApiKey = "IzaSyA-kcHbwnUCwZDbYjOoNoLMM9WjjU0WVl4";
  var fcmAuthDomain = "collabtic-app.firebaseapp.com";
  var fcmDbUrl = "https://collabtic-app.firebaseio.com";
  var fcmProjId = "collabtic-app";
  var fcmStorageBucket = "collabtic-app.appspot.com";
  var fcmSenderId = "550936066065";
  var fcmAppId = "1:550936066065:web:501f01e0b60fa738bb59b0";

//MAHLE
  /* var fcmApiKey = "AIzaSyCoAJgO0p3Q0Bj5ke0MHkH6BRGn_ijC_WI";
  var fcmAuthDomain = "mahle-17089.firebaseapp.com";
  var fcmDbUrl = "https://mahle-17089.firebaseio.com";
  var fcmProjId = "mahle-17089";
  var fcmStorageBucket = "mahle-17089.appspot.com";
  var fcmSenderId = "438537718573";
  var fcmAppId = "1:438537718573:web:f962e63fd562feb8fe61a4"; */

// MAHLE Firebase Config
export const environment = {
  production: true,
  webVersionCollabtic:4.2,
  webVersionMAHLE:2.2,
  webVersionTVS:2.32,
  webVersionTVSIB:2.1,
  webVersionCBA:2.25,
  webVersionMAHLEEurope:2.1,

  paymentKeys: {
    atg: 'jQdDdW-MAC7mM-7m8NtW-Cm5V39',
    collabtic: 'jQdDdW-MAC7mM-7m8NtW-Cm5V39'
  },
  firebase: {
    apiKey: fcmApiKey,
    authDomain: fcmAuthDomain,
    databaseURL: fcmDbUrl,
    projectId: fcmProjId,
    storageBucket: fcmStorageBucket,
    messagingSenderId: fcmSenderId,
    appId: fcmAppId,
  },
  auth: {
    clientId: "4e835741-d75c-4fbe-bf8a-13f6a7788ddd",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "http://localhost:4200/auth/integration",
    //redirectUri: 'https://collabtic.fieldpulse.co/cbt-v2/auth/integration'
  },

  theme: {
    default: {
      name: 'default',
      path: 'assets/json/default-theme.json'
    },
    cba: {
      name: 'cba',
      path: 'assets/json/cba-theme.json'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
