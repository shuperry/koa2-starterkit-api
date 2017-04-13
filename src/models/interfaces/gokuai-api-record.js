import moment from 'moment'

export default (sequelize, DataTypes) => {
  return sequelize.define('GokuaiAPIRecord', {
    record_id: {
      type: DataTypes.INTEGER,
      field: 'record_id',
      primaryKey: true,
      autoIncrement: true
    },
    mark: {
      type: DataTypes.STRING(100),
      defaultValue: 'uploadFile',
      field: 'mark'
    }, // mark api name.
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'status'
    },
    failedTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'failed_time'
    },
    param: {
      type: DataTypes.STRING(4000),
      defaultValue: '',
      field: 'param'
    },
    errorCode: {
      type: DataTypes.INTEGER,
      field: 'errorCode'
    },
    errorMsg: {
      type: DataTypes.STRING(1000),
      defaultValue: '',
      field: 'errorMsg'
    },
    created_at: {
      type: DataTypes.DATE(6),
      field: 'created_at',
      get: function () {
        const created_at = this.getDataValue('created_at')
        return moment.isDate(created_at) ? moment(created_at).valueOf() : created_at
      }
    },
    updated_at: {
      type: DataTypes.DATE(6),
      field: 'updated_at',
      get: function () {
        const updated_at = this.getDataValue('updated_at')
        return moment.isDate(updated_at) ? moment(updated_at).valueOf() : updated_at
      }
    }
  }, {
    timestamps: false,
    tableName: 'LEGAL_GOKUAI_API_RECORD',
    classMethods: {
      associate: ({GokuaiAPIRecord, File}) => {
        GokuaiAPIRecord.belongsTo(File, {
          foreignKey: 'file_id',
          as: 'file'
        })
      }
    },
    hooks: {
      beforeCreate: (instance) => {
        instance.created_at = Number(new Date())
        instance.updated_at = Number(new Date())
      },
      beforeUpdate: (instance) => {
        instance.updated_at = Number(new Date())
      }
    }
  })
}
