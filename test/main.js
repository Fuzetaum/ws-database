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
      db.create('user', { this: 'that' }, { this: 'that' }, () => {
        db.get('user', { this: 'that' }, (_, data) => console.log(data));

        db.create('user', { this: 'that' }, { this: 'something else' }, () => {
          db.get('user', { this: 'that' }, (_, data) => console.log(data));

          db.set('user', { this: 'that' }, () => {
            db.get('user', { this: 'that' }, (_, data) => console.log(data));
            db.set('user', { this: 'that' }, () => {});

            db.update('user', { this: 'that' }, { this: 'new value' }, () => {
              db.get('user', { this: 'that' }, (_, data) => console.log(data));

              db.deleteObject('user', { this: 'that' }, () => {
                db.get('user', { this: 'that' }, (_, data) => console.log(data));

                db.deleteObject('user', { this: 'new value' }, () => {
                  db.get('user', { this: 'new value' }, (_, data) => console.log(data));
                });
              });
            });
          });
        });
      });
  }
})();
