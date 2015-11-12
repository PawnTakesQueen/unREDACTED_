myApp.controller('NavCtrl', function($scope, $location) {
  $scope.$location = $location;
});

myApp.controller('ComposeCtrl', function($scope, $http, $location, $sce) {
  function gen_pass() {
    var result = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    for (var i = 0; i < 32; i++) {
      result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
  }
  function encrypt(ciphertext) {
    var password = gen_pass();
    $scope.$apply(function() {
      $scope.subject = '[CLASSIFIED]';
      $scope.message = '[CLASSIFIED]';
    });
    $('#background, #pgp_popup').show();
    generate_key_pair(password, function(keypair) {
      var encrypted_message = {};
      encrypted_message['message'] = ciphertext;
      var pubkey = keypair.publicKeyArmored;
      encrypted_message['pgp_pubkey'] = pubkey;
      var res = $http.post('/api/messages', encrypted_message);
      res.success(function(data, status, headers, config) {
        var id = data['id_pgp'];
        decrypt_message(keypair, id, password, function(id_decrypted) {
          $('#pgp_popup').hide();
          $('#id_popup').show();
          $scope.$apply(function() {
            $scope.id_confirm = 'ID: ' + id_decrypted.toString();
          });
        });
      });
    });
  }
  $scope.subject = '';
  $scope.message = '';
  $scope.id_confirm = 'test';
  $scope.okay = function() {
    $location.path('/');
  }
  $scope.submit = function() {
    get_attachment(function(attachment_value) {
      var message = '/SUBJECT' +
        $scope.subject.replace(/\\/g, '\\\\').replace(/\//g, '\\/') +
        '/MESSAGE' +
        $scope.message.replace(/\\/g, '\\\\').replace(/\//g, '\\/') +
        '/ATTACHMENT' +
        attachment_value.replace(/\\/g, '\\\\').replace(/\//g, '\\\/')
      $.get('/PGP.txt', function(pgp_pub) {
        encrypt_message(pgp_pub, message, function(ciphertext) {
          encrypt(ciphertext);
        });
      });
    });
  }
});

myApp.controller('RepliesCtrl', function($scope, $http) {
  $scope.id = '';
  $scope.reply = '';
  $scope.submit = function() {
    id_hash = CryptoJS.SHA512($scope.id);
    $http.get('/api/replies/' + id_hash).success(function(data) {
      if (Object.keys(data).length > 0) {
        var ct = data['message'];
        var hash = CryptoJS.SHA256($scope.id);
        var key = CryptoJS.enc.Hex.parse(hash.toString());
        var iv = CryptoJS.enc.Hex.parse(ct.substr(0, 32));
        var ciphertext = CryptoJS.enc.Base64.stringify(
          CryptoJS.enc.Hex.parse(ct.substr(32)));
        var decrypted = CryptoJS.AES.decrypt(ciphertext, key, {iv: iv});
        $scope.reply = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(decrypted.toString()))
      } else {
        $scope.reply = 'No reply at this time.'
      }
    });
  }
});
