function main() {
    var fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
     console.log("check failed?");
      return;
    }
    fs(window.TEMPORARY, 100, function(fs) {
        console.log(fs);
        console.log("it does not seem like you are in incognito mode");
        localStorage.removeItem('incognitoMode');
    }, function(err) {
        console.log(fs);
        localStorage.setItem('incognitoMode','1');
        console.log("it seems like you are in incognito mode");
    });
  }
  main();
  