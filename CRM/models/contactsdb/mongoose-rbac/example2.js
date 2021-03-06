var mongoose = require('mongoose')
  , rbac = require('./lib/index');

mongoose.connect('mongodb://localhost/rbac_example1');
mongoose.connection.once('open', function () {
  var UserSchema = mongoose.Schema({
    name: String
  });

  UserSchema.plugin(rbac.plugin);

  var User = mongoose.model('User', UserSchema);

  rbac.init({
    admin: [
      ['create', 'Post'],
      ['read', 'Post'],
      ['update', 'Post'],
      ['delete', 'Post']
    ],
    readonly: [
      ['read', 'Post']
    ]
  }, function (err, admin, readonly) {
    console.log(admin);
    console.log(readonly);

    var henry = new User({ name: 'henry' });

    henry.save();

    console.log('henry', henry);
    console.log('typeof henry.roles[0]', typeof henry.roles[0]);

    henry.addRole('admin', function () {
      console.log('henry.addRole(admin)', henry);
      console.log('typeof henry.roles[0]', typeof henry.roles[0]);
      console.log('inspect(henry.roles[0])', require('util').inspect(henry.roles[0]));

      henry.can('create', 'Post', function (err, canCreatePost) {
        console.log('henry.can(create, Post)', canCreatePost);
        console.log('typeof henry.roles[0]', typeof henry.roles[0]);
        console.log('inspect(henry.roles[0])', require('util').inspect(henry.roles[0]));

        henry.hasRole('admin', function (err, isAdmin) {
          console.log('henry.hasRole(admin)', isAdmin);
          console.log('typeof henry.roles[0]', typeof henry.roles[0]);
          console.log('inspect(henry.roles[0])', require('util').inspect(henry.roles[0]));
        });
      });
    });

  });
});
