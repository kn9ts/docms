// Adding the modules as arguments that
// have been injected above in the controller
var TodoController = function($scope, Todos) {
  $scope.newTodo = undefined;

  // Get all todo tasks from the server and persist them in cache/storage
  $scope.taskList = Todos.query(function() {
    console.log($scope.taskList);
  });

  $scope.addTask = function() {
    console.log('New todo task to be added -- ', $scope.newTodo);

    // Tell the other controllers a new task has been done
    // $rootScope.$broadcast('new_task_has_been_added', $scope.new_task);
    var newTodo = new Todos();
    newTodo.task = $scope.newTodo.trim();
    newTodo.isDone = 0; // false

    if (!newTodo.title) {
      return;
    }

    Todos.save(newTodo, function() {
        // Saves serialised newTodo object as JSON and send as POST body
        console.log("Task has been added/saved.");
        $scope.taskList.push(newTodo);
      })
      .$promise
      .then(function success() {
        $scope.newTodo = undefined;
      });
  };

  $scope.completeTask = function() {

  };

  $scope.updateTask = function() {

  };

  // $scope.$on('new_task_has_been_added', function(eventEmmitted, newTask) {
  //   // console.log('A new task was added', new_task);
  //   var task = {
  //     task: newTask,
  //     isDone: false
  //   };
  //   $scope.todoList.push(task);
  // });

  $scope.deleteTask = function(todoId) {
    console.log('DELETE button has just been clicked!');
    Todos.delete(todoId);
  };
};

module.exports = TodoController;
