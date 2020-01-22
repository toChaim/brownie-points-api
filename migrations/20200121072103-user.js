'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.createTable(
    'user',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      user_name: {
        type: 'string',
        length: 40,
        unique: true,
      },
      email: {
        type: 'string',
        unique: true,
      },
      password: {
        type: 'char',
        length: 128,
        notNull: true,
      }
    },
    function (err) {
      if (err) return callback(err);
      return callback();
    }
  );

  db.createTable(
    'pledge',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      creation_date: {
        type: 'timestamp',
        notNull: true,
        defaultValue: new String('CURRENT_TIMESTAMP'),
      },
      from: {
        type: 'int',
        notNull: true,
        foreignKey: {
          name: 'from_user',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      to: {
        type: 'int',
        foreignKey: {
          name: 'to_user',
          table: 'user',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        },
      },
      amount: {
        type: 'int',
        notNull: true,
      },
      for: {
        type: 'string',
        notNull: true,
      },
      resolve_date: {
        type: 'timestamp',
      },
      resolved: {
        type: 'boolean'
      }
    },
    err => { if (err) { return callback(err); } return callback(); }
  );

  return null;
};

exports.down = function (db, callback) {
  db.dropTable('pledge', callback);
  db.dropTable('user', callback);
  return null;
};

exports._meta = {
  version: 1
};
