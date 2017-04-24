/**
 * Created by perry on 2017/4/18.
 */
import moment from 'moment'

export default (sequelize, DataTypes) => {
  return sequelize.define('Log', {
    log_id: {
      type: DataTypes.INTEGER,
      field: 'log_id',
      primaryKey: true,
      autoIncrement: true
    },
    log_type: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'log_type',
      comment: '日志类型: 0: 操作日志, 1: 异常日志.'
    },
    method_Name: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'method_Name'
    },
    method_description: {
      type: DataTypes.STRING(1000),
      field: 'method_description'
    },
    request_params: {
      type: DataTypes.TEXT,
      field: 'request_params'
    },
    error_code: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'error_code'
    },
    error_message: {
      type: DataTypes.TEXT,
      field: 'error_message'
    },
    error_stack: {
      type: DataTypes.TEXT,
      field: 'error_stack'
    },
    created_at: {
      type: DataTypes.DATE(6),
      field: 'created_at'
    },
    updated_at: {
      type: DataTypes.DATE(6),
      field: 'updated_at'
    }
  }, {
    timestamps: false,
    tableName: 'LEGAL_LOG',
    comment: '系统日志表',
    getterMethods: {
      created_at () {
        const created_at = this.getDataValue('created_at')
        return moment.isDate(created_at) ? moment(created_at).valueOf() : created_at
      },
      updated_at () {
        const updated_at = this.getDataValue('updated_at')
        return moment.isDate(updated_at) ? moment(updated_at).valueOf() : updated_at
      }
    },
    classMethods: {
      associate: ({Log, File}) => {

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
