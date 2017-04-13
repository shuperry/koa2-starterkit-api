export default (sequelize, DataTypes) => {
  return sequelize.define('ModelDemo', {
    demo_id: {
      type: DataTypes.INTEGER,
      field: 'demo_id',
      primaryKey: true,
      autoIncrement: true
    },
    has_counter_claim: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'has_counter_claim'
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'enabled'
    }
  }, {
    timestamps: false,
    tableName: 'LEGAL_MODEL_DEMO'
  })
}
