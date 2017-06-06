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
    request_name: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'request_name',
      comment: '请求名称.'
    },
    request_path: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'request_path',
      comment: '请求路径.'
    },
    request_params: {
      type: DataTypes.TEXT,
      field: 'request_params',
      comment: '请求参数.'
    },
    request_description: {
      type: DataTypes.STRING(1000),
      field: 'request_description',
      comment: '请求说明.'
    },
    error_code: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'error_code',
      comment: '错误编号.'
    },
    error_message: {
      type: DataTypes.TEXT,
      field: 'error_message',
      comment: '错误消息.'
    },
    error_stack: {
      type: DataTypes.TEXT,
      field: 'error_stack',
      comment: '错误栈内容.'
    },
    created_at: {
      type: DataTypes.DATE(6),
      field: 'created_at',
      comment: '日志创建时间.'
    },
    created_by: {
      type: DataTypes.STRING(500),
      field: 'created_by',
      comment: '操作人 ldap 用户名.'
    }
  }, {
    timestamps: false,
    tableName: 'CRP_LOG',
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
      associate: ({Log, Category}) => {
        Log.belongsTo(Category, {
          foreignKey: 'sys_name_id',
          as: 'sys_name',
          comment: '系统名称.'
        })
        Log.belongsTo(Category, {
          foreignKey: 'log_type_id',
          as: 'log_type',
          comment: '日志类型.'
        })
        Log.belongsTo(Category, {
          foreignKey: 'operate_type_id',
          as: 'operate_type',
          comment: '操作类型.'
        })
        Log.belongsTo(Category, {
          foreignKey: 'request_method_id',
          as: 'request_method',
          comment: '请求方法名称.'
        })
      }
    },
    hooks: {
      beforeCreate: (instance) => {
        instance.created_at = Number(new Date())
      }
    }
  })
}
