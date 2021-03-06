SignCtrl.$inject = ['$scope', '$http', '$rootScope'];

function SignCtrl($scope, $http, $rootScope) {
  $scope.user = "";
  $scope.password = "";
  $scope.errormessage = "";
  $scope.successmessage = "";
  $rootScope.loggedin = false;
  $rootScope.mail = "";

  var logError = function(data, status) {
    console.log('code '+status+': '+data);
  };

  var refresh = function() {
    return $http.get('/?rnd='+new Date().getTime()).
      success(function() {

      }).error(logError);
  };

  $scope.signin = function(mailExtension) {
    $scope.user = $scope.user.toLowerCase();
    console.log('trying to sign in: '+$scope.user+','+$scope.password);
    $scope.errormessage = "";
    $scope.successmessage = "";

    $http.post('/signin?rnd='+new Date().getTime(), {user: $scope.user, password: $scope.password}).
      success(function() {
          $rootScope.loggedin = true;
          $rootScope.mail = $scope.user+"@"+mailExtension;
          
          var mailURI = encodeURIComponent($rootScope.mail).replace(/\./g, '&middot;')
          console.log('mailURI: '+mailURI);
          $http.get('/games/'+$rootScope.mail+'?rnd='+new Date().getTime()).
          success(function(data) {
            console.log('sign in process completed');
            $rootScope.gamedata = data;
            initGameData($rootScope.gamedata);
            console.log($rootScope.gamedata);
          }).error(logError);

      }).error(function(error, status) {
        switch(status) {
          case 403:
              $scope.errormessage = "Mail ou mot de passe invalide";
              break;
          case 404:
              $scope.errormessage = "Veuillez entrer votre mail";
              break;
          case 405:
              $scope.errormessage = "Veuillez entrer votre mot de passe";
              break;
          default:
              $scope.errormessage = "Erreur inconnue, code: "+status;
        }
      });

    //reset password in all cases
    $scope.password = "";
  };

  $scope.signup = function() {
    $scope.user = $scope.user.toLowerCase();
    console.log('trying to sign up: '+$scope.user);
    $scope.errormessage = "";
    $scope.successmessage = "";

    $http.post('/signup?rnd='+new Date().getTime(), {user: $scope.user}).
      success(function() {
          $scope.successmessage = "Vous recevrez dans quelques instants un e-mail avec votre nouveau mot de passe";
      }).error(function(error, status) {
        switch(status) {
          case 403:
              $scope.errormessage = "Mail invalide";
              break;
          case 404:
              $scope.errormessage = "Veuillez entrer votre mail";
              break;
          default:
              $scope.errormessage = "Erreur inconnue, code: "+status;
        }
      });

    //reset password in all cases
    $scope.password = "";

  };

  $scope.isHidden = function() {
    return $rootScope.loggedin
  }

  refresh();
}
