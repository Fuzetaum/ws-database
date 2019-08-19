const { properties } = require('@ricardofuzeto/ws-core').context;
const { type } = properties.get('database');
const wsDatabase = require('../index');

(async () => {
  const db = await wsDatabase;

  switch (type) {
    case 'firebase':
      db.create('user/zedascove', { this: 'that' });
      console.log(await db.get('user/zedascove'));
      
      db.create('user/zedascove', { this: 'something else' });
      console.log(await db.get('user/zedascove'));
      
      db.set('user/teste', { this: 'something else', that: 'another value' });
      console.log(await db.get('user/teste'));
      
      db.update('user/teste', { that: 'simple value' });
      console.log(await db.get('user/teste'));
      
      db.deleteObject('user/teste');
      console.log(await db.get('user/teste'));
    case 'mongodb':
      db.get('user/zedascove', (_, data) => console.log(data));
  }
})();
