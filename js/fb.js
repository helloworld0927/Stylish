// ========= FB
window.fbAsyncInit = function () {
  FB.init({
    appId: "843682476171705",
    cookie: true,
    xfbml: true,
    version: "v8.0",
  });

  FB.getLoginStatus(function (response) {
    // check login or not
    if (response.status === "connected") {
      FB.api(
        "/me",
        {
          fields: "id,name,email,picture",
        },
        function (response) {
          document.getElementById(
            "memberIconM"
          ).src = `http://graph.facebook.com/${response.id}/picture?type=small`;
          document.getElementById("memberIconM").style = "border-radius: 50%";
          document.getElementById(
            "memberIconW"
          ).src = `http://graph.facebook.com/${response.id}/picture?type=small`;
          document.getElementById("memberIconW").style =
            "border-radius: 50%; height: 38px; width: 38px";
        }
      );
    }
  });
};

(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    if (response.status === "connected") {
      window.location = "profile.html";
    } else {
      FB.login(
        function (response) {
          // console.log(response);
          if (response.status === "connected") {
            window.location = "profile.html";
          }
        },
        { scope: "public_profile,email" }
      );
    }
  });
}
