// ==UserScript==
// @name         冲浪助手
// @namespace    https://github.com/Shadow-blank/net-tools
// @version      0.1.2
// @description  让web页面更加容易浏览、操作
// @author       Shadow-blank
// @match        *://m.weibo.cn/status/*
// @match        *://www.comicat.org/*
// @match        *://2.comicat.net/*
// @match        *://3.comicat.net/*
// @match        *://dick.xfani.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/*
// @icon         https://github.com/Shadow-blank/net-tools/blob/main/favicon.ico
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict'

  // 微博移动端自动跳转到PC
  const weiboMJump2PC = () => {
    setTimeout(() => {
      const userId = document.querySelector('.m-img-box').href.split('/')[4]
      const id = location.pathname.split('/')[2]
      location.href = `https://weibo.com/${userId}/${id}`
    }, 500)
  }

  // 漫猫将下载按钮位置上升
  const comicatMoveDown = () => {
    const downEle = document.querySelector('#box_download')
    downEle.parentElement.insertBefore(downEle, downEle.parentElement.firstElementChild)
  }

  // 稀饭取消右键限制
  const xfaniRventMenu = () => {
    ['contextmenu', 'click', 'mousedown', 'mouseup', 'selectstart'].forEach(item => clearEvent(item))
    function clearEvent (type) {
      const onType = 'on' + type
      document[onType] = null
      document.body && (document.body[onType] = null)
    }
  }

  // bilibili去除首页轮播图 只保留番剧和推荐
  const bilibiliRomoveBanner = () => {
    // 取消bilibili默认样式
    const style = document.createElement('style')
    style.innerHTML = `
     .bili-video-card.is-rcmd{
        display: block!important; 
     }
     .recommended-swipe, .eva-extension-area, .battle-area, .live-card-list, .live-rank-conent, .video-card-list, .bili-grid:nth-child(n+10), .eva-banner{
        display: none!important; 
     }`
    document.querySelector('body').appendChild(style)
    // 去除轮播图
  }

  // 直播页面去掉广告 只显示直播
  const biliLiveRmoveOther = () => {
    let timer = ''
    // 推广直播页面进入原始页面
    timer = setInterval(() => {
      const iframe = document.querySelector('#app iframe')
      if (iframe?.src.includes('/blanc/')) {
        clearInterval(timer)
        location.href = iframe.src.split('?')[0]
      }
    }, 100)
    // 将直播画面居中显示
    document.querySelector('.live-room-app.p-relative').style.overflow = 'hidden'
    document.querySelector('main').style.padding = '0px'
    document.querySelector('.player-ctnr.left-container.p-relative.z-player-ctnr').style = 'width: 100%; margin: 10px auto'
    document.querySelector('#iframe-popup-area').remove()
    document.querySelector('section').style.margin = '0px'
  }

  const host = location.host

  const hostMap = {
    'm.weibo.cn': weiboMJump2PC,
    '2.comicat.net': comicatMoveDown,
    '3.comicat.net': comicatMoveDown,
    'dick.xfani.com': xfaniRventMenu,
    'www.bilibili.com': bilibiliRomoveBanner,
    'live.bilibili.com': biliLiveRmoveOther
  }

  hostMap[host] && hostMap[host]()

})()
