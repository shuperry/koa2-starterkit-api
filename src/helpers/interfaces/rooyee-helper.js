import config from '../../config'

/**
 发送(图片)广播消息(用户 -> 用户).
 params：
 rtpwebid  String  true  源名称
 user  string  true  发送人, 空代表系统
 orgName string  true  接收组织, 组织名称全路径, 例如level/level_1
 toUser  string  true  接收人, 接收人的jid或用户名
 noticeType  string  true  通知类型：normal普通通知, headline系统通知, 仅在线用户可以收到系统通知
 noticeRange string  true  通知范围：normal普通通知分全部(all)和仅在线用户(online), headline系统通知, 仅在线用户可以收到系统通知,则为空
 msgType string  true  消息类型, 分文本消息, 图文消息和多图文消息三种, 即 text, picture 和 newsgroups
 params  string  true  对应类型的参数, 必须是符合json规范的字符串。 当msgType=picture时, 可用参数如下：{title:标题,picture:图片内容,brief:简介,hyperlink:超链接 }；当msgType=newsgroups 时, 用参数如下：{msgs:[{text:说明,img:图片,url:超链接},...]}；当msgType=text时, 可用参数如下：{msg:消息内容}
 */
const createPictureMsgBroadcast = async ({
    user = config.get(
      'rooyee:appKey'), orgName = '', toUser, noticeType = 'normal', noticeRange = 'all', msgType = 'picture', title = '标题', picture = config.get(
      'rooyee:broadcast:defaultImage'), brief = '', hyperlink = ''
  }) => {
  const {models} = legal

  const params = {
    user,
    orgName,
    toUser,
    noticeType,
    noticeRange,
    msgType,
    pic_msg: {
      title,
      picture,
      brief,
      hyperlink
    }
  }

  await models.Broadcast.create(params, {
    include: [
      {
        model: models.BroadcastPictureMsg,
        as: 'pic_msg'
      }
    ]
  })
}

export {createPictureMsgBroadcast}
