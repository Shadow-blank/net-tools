// ==UserScript==
// @name         冲浪助手
// @namespace    https://github.com/Shadow-blank/net-tools
// @version      0.1
// @description  让web页面更加容易浏览、操作
// @author       Shadow-blank
// @match        https://m.weibo.cn/status/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.cn
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  const weiboMFn = () => {
    setTimeout(()=>{
      const userId = document.querySelector('.m-img-box').href.split('/')[4]
      const id =  location.pathname.split('/')[2]
      location.href = `https://weibo.com/${userId}/${id}`
    }, 500)
  }

  const host = location.host

  const weiboHostM = 'm.weibo.cn'


  switch (host) {
    case weiboHostM :
      weiboMFn()
    break
  }

})();
