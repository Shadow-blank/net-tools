// ==UserScript==
// @name         冲浪助手
// @namespace    https://github.com/Shadow-blank/net-tools
// @version      0.1.1
// @description  让web页面更加容易浏览、操作
// @author       Shadow-blank
// @match        *://m.weibo.cn/status/*
// @match        *://www.comicat.org/*
// @match        *://2.comicat.net/*
// @match        *://3.comicat.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.cn
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

  const comicatMoveDown = () => {
    const downEle = document.querySelector('#box_download')
    downEle.parentElement.insertBefore(downEle, downEle.parentElement.firstElementChild)
  }

  const host = location.host

  const hostMap = {
    'm.weibo.cn': weiboMJump2PC,
    '2.comicat.net': comicatMoveDown,
    '3.comicat.net': comicatMoveDown
  }

  hostMap[host] && hostMap[host]()

})()
