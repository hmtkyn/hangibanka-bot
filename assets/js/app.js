function init() {
  gapi.load('auth2', function () {
    gapi.auth2.init();
  });
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log(profile);
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var Name = profile.getName();
  var Email = profile.getEmail();
  var ProfileImg = profile.getImageUrl();

  var addHTML = "<ul><li>Hoşgeldiniz.</li><li>" + Name + "</li><li>" + Email + "</li><li><img src='" + ProfileImg + "'></li></ul>"

  document.getElementById('getAccount').innerHTML = addHTML;
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    document.querySelectorAll('#getAccount > *').remove();
  });
}