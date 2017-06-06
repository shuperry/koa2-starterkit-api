import moment from 'moment'

export default (sequelize, DataTypes) => {
  return sequelize.define('File', {
    file_id: {
      type: DataTypes.INTEGER,
      field: 'file_id',
      primaryKey: true,
      autoIncrement: true
    },
    original_name: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'original_name'
    },
    file_name: {
      type: DataTypes.STRING(500),
      defaultValue: '',
      field: 'file_name'
    },
    file_path: {
      type: DataTypes.STRING(4000),
      defaultValue: '',
      field: 'file_path'
    },
    full_path: {
      type: DataTypes.STRING(4000),
      defaultValue: '',
      field: 'full_path'
    },
    file_size: {
      type: DataTypes.INTEGER,
      field: 'file_size'
    },
    content_type: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      field: 'content_type'
    },
    is_folder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'is_folder'
    },

    // 标识文件来源类型: 1: create_case, 2: business_folder, 3: business_data, 4: journal, 5: doc_centeral.
    mark: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'mark'
    },

    is_deleted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'is_deleted'
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
    tableName: 'CRP_FILE',
    hierarchy: {
      levelFieldName: 'level',
      foreignKey: 'parent_id',
      foreignKeyAttributes: 'parent',
      throughTable: 'CRP_FILE_ANCETORS',
      throughKey: 'file_id',
      throughForeignKey: 'parent_file_id'
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
      associate: ({File}) => {

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
