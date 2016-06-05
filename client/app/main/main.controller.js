'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket, Modal, Auth) {
    this.$http = $http;
    this.socket = socket;
    this.messages = [];
    this.isAdmin = Auth.isAdmin;

    // Our callback function is called if/when the delete modal is confirmed
    this.showMessage = Modal.confirm.delete(message => {
      this.$http.delete('/api/messages/' + message._id);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('message');
    });

    if (document.body.getElementsByClassName('triangle-bg')[0]) {
      var element = document.body.getElementsByClassName('triangle-bg')[0];
      var pattern_height = element.clientHeight*1.5;
      var pattern_width = element.clientWidth;
      var pattern_x_color = 'Blues';
      var pattern_cell_size = Math.floor(Math.random() * 20) + 30;
      var pattern = Trianglify({
        height: pattern_height,
        width: pattern_width,
        x_colors: pattern_x_color,
        cell_size: pattern_cell_size,
      });
      element.setAttribute('style', 'background-image: url('+pattern.canvas().toDataURL("image/png")+')');
    }

  }

  $onInit() {
    this.$http.get('/api/messages').then(response => {
      this.messages = response.data;
      this.socket.syncUpdates('message', this.messages);
    });
  }

  addMessage() {
    if (this.newMessage) {
      this.$http.post('/api/messages', this.newMessage);
      this.newMessage = '';
    }
  }

  deleteMessage(message) {
    this.$http.delete('/api/messages/' + message._id);
  }

  isAdmin() {
    this.isAdmin;
  }

}

angular.module('aliimsApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
