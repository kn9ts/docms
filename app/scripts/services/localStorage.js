var localStorageService = function($cookies) {
  return {
    save: function(key, options) {
      if (options) {
        // store this data in local and in cookie too
        if (options.cookie) {
          if ($cookies) $cookies(key, options.content);
          localStorage.setItem(key, JSON.stringify(options.content));
        }
        // also
        else {
          localStorage.setItem(key, JSON.stringify(options.content));
        }
      }
      // If a False boolean is provided as the option instead, remove all data related with the key
      else if (options === false) {
        localStorage.removeItem(key);
        if ($cookies) $cookies(key, false); // remove everything
        console.log("------- DATA removed from LocalStorage -----------");
        return true;
      }

      // if only one argument is given retrieve that data from localstorage
      return arguments.length == 1 ? JSON.parse(localStorage.getItem(key)) : false;
    },
    flush: function() {
      localStorage.clear();
      return true;
    }
  };
};
