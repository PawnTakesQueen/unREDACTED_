myApp.controller('IndexCtrl', function($scope) {
});

myApp.controller('ComposeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $scope.submit = function() {
    get_attachment(function(attachment_value) {
      var message = '/SUBJECT' +
        $('#subject > input').val().replace(/\\/g, '\\\\').replace(/\//g, '\\/') +
        '/MESSAGE' +
        $('#message > textarea').val().replace(/\\/g, '\\\\').replace(/\//g, '\\/') +
        '/ATTACHMENT' +
        attachment_value.replace(/\\/g, '\\\\').replace(/\//g, '\\\/') +
        '/PASSWORD' +
        $('#password > input').val().replace(/\\/g, '\\\\').replace(/g\//g, '\\/');
      console.log(message);
      if ($('#security > select').val() == 'High') {
        jQuery.get('/PGP.txt', function(pgp_pub) {
          encrypt_message(pgp_pub, message, function(ciphertext) {
            console.log(ciphertext);
          });
        });
      } else if ($('#security > select').val() == 'Sensitive') {
        jQuery.get('/PGP_AIRGAP.txt', function(pgp_pub) {
          encrypt_message(pgp_pub, message, function(ciphertext) {
            console.log(ciphertext);
          });
        });
      }
    });
  }
}]);

myApp.controller('RepliesCtrl', function($scope) {
});
