var self = require('sdk/self');
var { add } = require('about-what');

add({
  what: 'foo',
  url: self.data.url('config.html')
});
