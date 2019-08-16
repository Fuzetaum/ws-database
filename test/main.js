const { create, deleteObject, get, set, update } = require('../index');

create('user/zedascove', { this: 'that' });
get('user/zedascove').then(value => console.log(value));

create('user/zedascove', { this: 'something else' });
get('user/zedascove').then(value => console.log(value));

set('user/teste', { this: 'something else', that: 'another value' });
get('user/teste').then(value => console.log(value));

update('user/teste', { that: 'simple value' });
get('user/teste').then(value => console.log(value));

deleteObject('user/teste');
get('user/teste').then(value => console.log(value));
