var str = document.querySelector('html').innerHTML
str = str.slice(str.indexOf('commonui.userInfo.setAll'))
var userData = {}
var reg2 = /commonui\.userInfo\.setAll\(([\S\s]+)\)[\s]+\/\/userinfoend/g
const a = str.replaceAll(reg2, (str, data) => {
  userData = JSON.parse(data)
})

console.log(userData)

var reg = /uid=([\d]+)[\S\s]+?time['"]>([^<]{10,20})[\S\s]+?id=[\S\s]+?postcontent([\d]+)[\S\s]+?ubbcode['"]>([\S\s]+?)<\/(span|p)[\S\s]+?(ngaAds\.bbs_ads31)/g

const contentList = {}
str.replaceAll(reg, (str, uid, time, index, content) => {
  const [, votes, os] = /['"]0,([\d]+),0['"][\d,'"\s]+([a-zA-Z]+)/.exec(str) || []
  const smile = /s:([\w]+):([\w\u4e00-\u9fa5]+)/
  const p = /^pid=([0-9]+,)+/
  const p2 = /^\/pid/
  content = content.replace(/\[([\/]?[a-zA-Z0-9\u4e00-\u9fa5=,:]+)\]/g, (str, b, c, d) => {
    switch (b) {
      case 'quote' :
        return '<div class="quote">'
      case '/quote':
        return '</div>'
        break
      case 'b':
      case '/b':
        return ' '
        break
      case '/pid':
        return `<span></span>`
      default:
        if (smile.test(b)) {
          const [, type, code] = smile.exec(b)
          return `<img class="smile_${type}" src="https://img4.nga.178.com/ngabbs/post/smile/${ubbcode.smiles[type][code]}.png" alt="${code}">`
        } else if (p.test(b)) {
          const [tid, topid, page] = b.replace(/[^\d,]/g, '').split(',')
          return `<a href="${location.origin}/read.php?tid=${tid}&topid=${topid}&page=${page}#pid${topid}Anchor" class="block_txt block_txt_c2" style="font-weight:normal;line-height:1.2em;margin-right:-0.25em" title="打开链接" target="_blank">+</a>`
        }
        return str
    }
  })
  const userInfo = userData[uid]
  const [, num] = userInfo.reputation && userInfo.reputation.match(new RegExp(`${__CURRENT_FID}_(-?[\d]+)`)) || [, 0]
  userInfo.reputation = +num
  const levelIndex = __CUSTOM_LEVEL.findIndex(item => item.r >= num)
  userInfo.rText = __CUSTOM_LEVEL[levelIndex - 1].n
  userInfo.rLever = levelIndex - 3
  userInfo.regdate = commonui.time2date(userInfo.regdate, 'Y-m-d H:i')
  userInfo.thisvisit = commonui.time2date(userInfo.thisvisit, 'Y-m-d H:i')
  contentList[index] = {
    userInfo,
    time,
    content,
    votes,
    os
  }
})

let doc = ''
for (const index in contentList) {
  const {votes, os, time, content, userInfo} = contentList[index]
  doc += `
  <div class="row flex">
    <div class="row-left">
      ${getRowLeft(index, userInfo)}
    </div>
    <div class="row-right">
      <div>
        <div class="goodbad" style="display: inline-block;">
            <span class=" small_colored_text_btn block_txt_c2 stxt ogoodbtn">
              <span class=" urltip nobr" style="margin-top: -1.8em; color: rgb(88, 105, 123);"></span>
                <a class=" white" href="javascript:void(0)" title="支持">
                  <svg xmlns="http://www.w3.org/2000/svg" class="iconfont" viewBox="0 0 896 1000" style="margin:0 0.5em 0 0.3em;height:1em;">
                   <path d="m896 466.2-.063 63.1a79.3 79.3 0 0 1-5.8 30.9L763.4 849.8c-11.7 29-40.9 50.2-76 50.2l-354.1-.063c-44.8 0-83.8-38.6-83.8-83.1V405.4c0-23.2 9.7-42.5 25.3-58L547.6 75l44.8 44.4c11.7 11.6 17.5 25.1 17.5 42.5v13.5l-41 209.1 243.1.438c44.9 0 83.9 36.7 83.9 81.2ZM0 899.9V405.4h167.6v494.6H.005Z"></path>
                  </svg>
                </a>
              <span title="" style="color: rgb(255, 255, 255);">${votes || ''}</span>
                <a class=" white" href="javascript:void(0)" title="反对">
                  <svg xmlns="http://www.w3.org/2000/svg" class="iconfont" viewBox="0 0 896 1000" style="margin:0 0.3em 0 0.5em;height:1em;">
                    <path d="m0 533.8.063-63.1a79.3 79.3 0 0 1 5.8-30.9L132.6 150.2c11.7-29 40.9-50.2 76-50.2l354.1.063c44.8 0 83.8 38.6 83.8 83.1v411.5c0 23.2-9.7 42.5-25.3 58L348.4 925l-44.8-44.4c-11.7-11.6-17.5-25.1-17.5-42.5v-13.5l41-209.1-243.1-.438C39 615 0 578.3 0 533.8Zm896-433.7v494.6H728.4V100.1H896Z"></path>
                  </svg>
                </a>
              </span>
              <span class="stxt">&ZeroWidthSpace;</span>
          </div>
        <div class="postInfo" style="line-height: inherit; color: rgb(136, 136, 136);">
          <span class="postdatec stxt">${time}</span>
          ${getOSElement(os)}
        </div>
      </div>
      <br>
      <span>${content}</span>
    </div>
  </div>
  `
}


function getOSElement(os) {
  if (!os) return `<div class="inlineBlock stxt"></div>`
  else if (os === 'iOS') {
    return `
      <a title="发送自 iOS 上的 NGA官方客户端" class="inlineBlock stxt" href="http://app.nga.cn" style=" filter: none; margin-left: 0.7em;">
        <svg xmlns="http://www.w3.org/2000/svg" class="iconfont" viewBox="0 0 707 1000" style="height:1.5em;fill:#82a8a6">
          <path d="M363.8 356.3a321 321 0 0 0-76.3-49.5A216.2 216.2 0 0 0 209 291.7s-81.8 8.4-132.3 50.7C25.6 385.4 5.8 462.3 5.8 462.3a579.8 579.8 0 0 0-3.9 128.7A504.6 504.6 0 0 0 30 706.5s31.2 66.4 76 112.6a294.7 294.7 0 0 0 105.4 72.7 466 466 0 0 0 61.3 7.4 227.2 227.2 0 0 0 59.2-15.8 166.3 166.3 0 0 0 45.1-32l41.6 28.4L470.3 900h48.4s74.5-21.6 121.6-68.4c46.9-46.7 66.4-118.6 66.4-118.6L643.8 671.9a173.9 173.9 0 0 1-54.9-123.3 185.4 185.4 0 0 1 50.8-123.2l55.8-38.6s-48.9-65.5-110.6-84c-58-17.4-129 12.1-129 12.1l-62.9 41.4h-29Zm19.4-55.3 62.9-41.5 48.4-55.3 38.7-64.5 13.9-64.7-67.8 20.6-72.8 47.4-36 45.7-6.7 52.4Z"></path>
        </svg>
      </a>`
  } else {
    return `
      <a title="发送自 Android 上的 NGA官方客户端" class="inlineBlock stxt" href="http://app.nga.cn" style=" filter: none; margin-left: 0.7em;">
        <svg xmlns="http://www.w3.org/2000/svg" class="iconfont" viewBox="0 0 730 1000" style="height:1.5em;fill:#82a8a6">
          <path d="M604.9 348.4H124.4s8-118.1 108.1-176.9l-34.7-67.8a20.3 20.3 0 0 1 11.9-25.3 24.6 24.6 0 0 1 29.8 3.9l36 70.4a283.8 283.8 0 0 1 89.7-13.7 282.4 282.4 0 0 1 90.4 14l36.2-70.6a24.6 24.6 0 0 1 29.8-3.9 20.3 20.3 0 0 1 11.9 25.3L498.6 171.9c99 58.9 106.3 176.4 106.3 176.4Zm-1.9 373.1a65.7 65.7 0 0 1-14.1 26.4 43.5 43.5 0 0 1-23.6 10h-58.4v131.1s-7.5 36.4-52.8 36.4-50.9-36.4-50.9-36.4V757.9h-77.3v131.1s-5.7 36.4-50.8 36.4-52.8-36.4-52.8-36.4V757.9h-58.4a43.5 43.5 0 0 1-23.6-10 65.7 65.7 0 0 1-14.1-26.4V386.6h476.8v334.9ZM50.9 353.8a49 49 0 0 1 49 38.2V641.4s-3.8 36.4-47.1 36.4A52.3 52.3 0 0 1 0 641.4V390.2a51.4 51.4 0 0 1 50.9-36.4Zm627.5 0a49 49 0 0 0-49 38.2V641.4s3.8 36.4 47.1 36.4a52.3 52.3 0 0 0 52.8-36.4V390.2a51.4 51.4 0 0 0-50.9-36.4h-.009Z"></path>
        </svg>
      </a>`
  }
}

function getAvatar(src) {
  return `
    <img src="${src}" style="max-width:180px;max-height:255px;border-width:1px;" class="avatar">
  `
}

function getRowLeft(index, userInfo) {
  return `
    <span class="posterinfo" style="display: block;">
      <div style="text-align:left;line-height:1.5em">
        <span class="right">&nbsp;
          <a href="javascript:void(0)" class="small_colored_text_btn stxt block_txt_c0 vertmod">#${index}</a>
        </span>
        <a href="nuke.php?func=ucp&uid=${userInfo.uid}" class="author b nobr">
          <b class="block_txt" style="padding-left:0.2em;padding-right:0.2em;min-width:1em;text-align:center;background:#3b6843;color:#ffffff">
          ${userInfo.username.slice(0, 1)}
          </b>${userInfo.username.slice(1)}
        </a> 
        <a href="javascript:void(0)" name="uid" class="small_colored_text_btn stxt block_txt_c0 vertmod" style="background:#bbb">${userInfo.uid}</a>
      </div>
      ${userInfo.avatar ? getAvatar(userInfo.avatar) : ''}
      <div class="stat" style="margin:2px 0 0 0">
        <div style="width:100%">
          <div>
            <div class="r_container" style="margin:2px 0 1px 0" title="用户${userInfo.username}的声望 &emsp;${userInfo.reputation}">
                    <div style="width:${Math.abs(userInfo.reputation) / 10}%" class="r_bar"></div>
            </div>
            <div style="float:left;margin-right:3px;min-width:49%;*width:49%">
             <nobr>级别: 
              <span class="silver">${userInfo.rText}</span>
              </nobr>
            </div>
            <div style="float:left;margin-right:3px">
              <nobr>声望: 
                <span class="silver numericl">${userInfo.reputation}(lv${userInfo.rLever})</span>
              </nobr>
            </div>
            <div style="float:left;margin-right:3px;min-width:49%;*width:49%">
              <nobr>
                <span title=" 注册时间: ${userInfo.regdate} 
                   最后登陆: ${userInfo.thisvisit} ">
                      注册: 
                      <span class="numeric silver" name="regdate">${userInfo.regdate.slice(2, 10)}</span>
                </span>
              </nobr>
            </div>
            <div style="float:left">
              <nobr>威望: 
                <span class="numericl silver">${Math.floor(userInfo.rvrc / 10)}</span>
                <span class="silver">(${userData.__GROUPS[userInfo.memberid][0]})</span>
              </nobr>
            </div>
            <div class="clear"></div>
          </div>
            <span class="clickextend" style="">
              <div class="clear"></div>
            </span>
        </div>
        <div class="stat_spacer"></div>
      </div>
    </span> `
}


console.log(contentList)
// document.querySelector('#root').innerHTML = doc

const style = document.createElement('style')

document.body.appendChild(style)
