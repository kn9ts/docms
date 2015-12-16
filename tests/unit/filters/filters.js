describe('Filters', function() {

  beforeEach(module('app.filters'));

  //this is how we inject a filter by appending Filter to the end of the filter name
  it('should capitalize the 1st letter', inject(function(capitalizeFilter) {
    expect(capitalizeFilter('bigname')).to.be.equal('Bigname');
  }));

  it('should capitalize the 1st letter', inject(function(timeagoFilter) {
    expect(timeagoFilter(moment())).to.be.equal('a few seconds ago');
  }));
});
