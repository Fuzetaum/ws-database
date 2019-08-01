const { get, set } = require('../index');

get('user/zedascove').then(value => console.log(value));

set('user/teste', { this: 'something else' });
get('user/teste').then(value => console.log(value));
