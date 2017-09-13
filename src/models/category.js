import moment from 'moment'

export default (sequelize, DataTypes) => {
  const model = sequelize.define('Category', {
    category_id: {
      type: DataTypes.INTEGER,
      field: 'category_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'name',
      comment: '名称.'
    },
    code: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'code',
      comment: '唯一且规范命名的编码, 可在业务中使用.'
    },
    rank: {
      type: DataTypes.DOUBLE(11, 4),
      field: 'rank',
      comment: '当前所处层次的排序.'
    },
    remark: {
      type: DataTypes.STRING(4000),
      defaultValue: '',
      field: 'remark',
      comment: '备注.'
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
    comment: '通用类别, 树形结构, parent_id 字段自关联.',
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
        const dataVal = this.getDataValue('created_at')
        return moment.isDate(dataVal) ? moment(dataVal).valueOf() : dataVal
      },
      updated_at () {
        const dataVal = this.getDataValue('updated_at')
        return moment.isDate(dataVal) ? moment(dataVal).valueOf() : dataVal
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

  model.associate = ({Category}) => {

  }

  return model
}
