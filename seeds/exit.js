module.exports = function() {
  setInterval(function() {
    console.log('EXIT SIGNAL RECIEVED. EXITING PROCESS...');
    process.exit(0);
  }, 500);
};
