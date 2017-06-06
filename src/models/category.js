import moment from 'moment'

export default (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      field: 'category_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'name'
    },
    code: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'code'
    },
    relate_parent_code: {
      type: DataTypes.STRING(2000),
      defaultValue: '',
      field: 'relate_parent_code'
    },
    labels: {
      type: DataTypes.TEXT,
      field: 'labels'
    },
    value: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'value'
    },
    rank: {
      type: DataTypes.DOUBLE(11, 4),
      field: 'rank'
    },
    remark: {
      type: DataTypes.STRING(4000),
      defaultValue: '',
      field: 'remark'
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
    tableName: 'CRP_CATEGORY',
    hierarchy: {
      levelFieldName: 'level',
      foreignKey: 'parent_id',
      foreignKeyAttributes: 'parent',
      throughTable: 'CRP_CATEGORY_ANCETORS',
      throughKey: 'category_id',
      throughForeignKey: 'parent_category_id'
    },
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
      associate: ({Category}) => {

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
