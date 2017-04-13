const createGokuaiAPIRecord = async (params) => {
  const {models} = legal

  return await models.GokuaiAPIRecord.create(params)
}

export {createGokuaiAPIRecord}
