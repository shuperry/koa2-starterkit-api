export default (sequelize, DataTypes) => {
  return sequelize.define('BroadcastPictureMsg', {
    msg_id: {
      type: DataTypes.INTEGER,
      field: 'msg_id',
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(500),
      defaultValue: '标题',
      field: 'title',
      allowNull: false
    },
    picture: {
      type: DataTypes.TEXT,
      field: 'picture'
    },
    brief: {
      type: DataTypes.STRING(500),
      defaultValue: '简介',
      field: 'brief',
      allowNull: false
    },
    hyperlink: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'hyperlink',
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'LEGAL_BROADCAST_PICTURE_MSG'
  })
}
