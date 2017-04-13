import moment from 'moment'

export default (sequelize, DataTypes) => {
  return sequelize.define('Broadcast', {
    broadcast_id: {
      type: DataTypes.INTEGER,
      field: 'broadcast_id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'user',
      allowNull: false
    },
    orgName: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'org_name'
    },
    toUser: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'to_user',
      allowNull: false
    },
    noticeType: {
      type: DataTypes.STRING(100),
      defaultValue: 'normal',
      field: 'notice_type',
      allowNull: false
    },
    noticeRange: {
      type: DataTypes.STRING(100),
      defaultValue: 'all',
      field: 'notice_range',
      allowNull: false
    },
    msgType: {
      type: DataTypes.STRING(100),
      defaultValue: 'text',
      field: 'msg_type',
      allowNull: false
    },
    msg: {
      type: DataTypes.STRING(4000),
      defaultValue: '',
      field: 'msg'
    },
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
    tableName: 'LEGAL_BROADCAST',
    classMethods: {
      associate: ({Broadcast, BroadcastPictureMsg, BroadcastNewsGroupsMsg}) => {
        Broadcast.hasOne(BroadcastPictureMsg, {
          foreignKey: 'broadcast_id',
          as: 'pic_msg'
        })
        Broadcast.hasMany(BroadcastNewsGroupsMsg, {
          foreignKey: 'broadcast_id',
          as: 'group_msgs'
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
