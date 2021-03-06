var mongoose = require('mongoose')
  , rbac = require('./lib/index');

mongoose.connect('mongodb://localhost/rbac_example');
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

    console.log('1', henry);

    henry.save();

    console.log('2', henry);

    henry.hasRole('readonly', function (err, hasreadonly) {
      console.log('3', hasreadonly);

      henry.addRole('readonly', function () {
        console.log('4', henry);

        henry.hasRole('readonly', function (err, hasreadonly) {
          console.log('5', hasreadonly);
          console.log('typeof henry.roles[0]', typeof henry.roles[0], require('util').inspect(henry.roles[0]));

          henry.hasRole('admin', function (err, hasadmin) {
            console.log('6', hasadmin);

            henry.addRole('admin', function () {
              console.log('7', henry);

              henry.hasRole('admin', function (err, hasadmin) {
                console.log('8', hasadmin);

                User.findById(henry.id, function (err, henry2) {
                  rbac.Role.findOne({name: 'admin'}, function (err, admin2) {
                    rbac.Role.findOne({name: 'readonly'}, function (err, readonly2) {
                      console.log('9', henry2.roles.indexOf(admin2._id));
                      console.log('10', henry2.roles.indexOf(readonly2._id));
                      console.log(typeof admin2.id, typeof admin2._id);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  });
});
