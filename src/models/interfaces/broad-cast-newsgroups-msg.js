export default (sequelize, DataTypes) => {
  return sequelize.define('BroadcastNewsGroupsMsg', {
    msg_id: {
      type: DataTypes.INTEGER,
      field: 'msg_id',
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING(500),
      defaultValue: '文本',
      field: 'text',
      allowNull: false
    },
    img: {
      type: DataTypes.TEXT,
      field: 'img'
    },
    url: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'url',
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'LEGAL_BROADCAST_NEWSGROUPS_MSG'
  })
}
