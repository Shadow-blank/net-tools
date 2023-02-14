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

  // 漫猫将下载按钮位置上升
  const comicatMoveDown = () => {
    const downEle = document.querySelector('#box_download')
    downEle.parentElement.insertBefore(downEle, downEle.parentElement.firstElementChild)
  }

  // 稀饭取消右键限制
  const xfaniRventMenu = () => {

    function R(type) {
      const onType = "on" + type;
      window.addEventListener(type, function (e) {
        for (let n = e.originalTarget; n; n = n.parentNode) {
          n[onType] = null;
        }
      }, true);
      window[onType] = null;
      document[onType] = null;
      if (document.body) {
        document.body[onType] = null;
      }
    }

    R("contextmenu");
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
  }

  const host = location.host

  const hostMap = {
    'm.weibo.cn': weiboMJump2PC,
    '2.comicat.net': comicatMoveDown,
    '3.comicat.net': comicatMoveDown,
    "dick.xfani.com": xfaniRventMenu
  }

  hostMap[host] && hostMap[host]()

})()
