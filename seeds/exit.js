module.exports = function() {
  setInterval(function() {
    console.log('EXIT SIGNAL RECEIVED. EXITING PROCESS...');
    process.exit(0);
  }, 500);
};
