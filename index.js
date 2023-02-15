// ==UserScript==
// @name         冲浪助手
// @namespace    https://github.com/Shadow-blank/net-tools
// @version      0.1.4
// @description  让web页面更加容易浏览、操作
// @author       Shadow-blank
// @match        *://m.weibo.cn/status/*
// @match        *://www.comicat.org/*
// @match        *://*.comicat.net/*
// @match        *://dick.xfani.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/*
// @icon         https://raw.githubusercontent.com/Shadow-blank/net-tools/main/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(function () {
  'use strict'
  // 创建style标签
  const createStyle = str => $('body').append(`<style>${str}</style>`)

  let data = null

  const module = {
    weibo: {
      name: '微博',
      checked: true,
      children: [
        {
          key: 'm.weibo.cn',
          name: '移动端页面自动跳转到PC页面 屏幕宽度小于980不跳转',
          checked: true,
          run() {
            if (window.screen.width > 980) {
              setTimeout(() => {
                const userId = document.querySelector('.m-img-box').href.split('/')[4]
                const id = location.pathname.split('/')[2]
                location.href = `https://weibo.com/${userId}/${id}`
              }, 500)
            }
          }
        }
      ]
    },
    comicat: {
      name: '漫猫',
      checked: true,
      children: [
        {
          key: 'comicat.net',
          name: '下载按钮位置上升',
          checked: true,
          run() {
            const downEle = document.querySelector('#box_download')
            downEle.parentElement.insertBefore(downEle, downEle.parentElement.firstElementChild)
          }
        }
      ]
    },
    xfani: {
      name: '稀饭',
      checked: true,
      children: [
        {
          key: 'dick.xfani.com',
          name: '取消右键限制',
          checked: true,
          run() {
            ['contextmenu', 'click', 'mousedown', 'mouseup', 'selectstart'].forEach(item => clearEvent(item))

            function clearEvent(type) {
              const onType = 'on' + type
              document[onType] = null
              document.body && (document.body[onType] = null)
            }
          }
        }
      ]
    },
    bilibili: {
      name: 'B站',
      checked: true,
      children: [
        {
          key: 'www.bilibili.com',
          name: '去除首页轮播图 只保留番剧和推荐',
          checked: true,
          run() {
            createStyle(`
          .bili-grid, .recommended-swipe, .eva-banner{display: none!important;}
          .bili-video-card.is-rcmd, .bili-grid:nth-child(9), .bili-grid:nth-child(1) {display: block!important;} `)
          }
        },
        {
          key: 'live.bilibili.com',
          name: '直播页面去掉广告 只显示直播',
          checked: true,
          run() {
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
            createStyle(`         
                      .live-room-app.p-relative{overflow: hidden}
                      .main {padding: 0px}
                      .player-ctnr.left-container.p-relative.z-player-ctnr{ width: 100%;  margin: 10px auto}
                      #iframe-popup-area{ display: none}
                      section{margin: 0}`)
          }
        }
      ]
    }
  }

  // 初始化控制面板
  const controlPanel = {
    status: 0, //0 不存在 1存在
    show() {
      $('#control-panel').css('display', 'block')
    },
    hidden() {
      $('#control-panel').css('display', 'none')
    },
    save() {

    }
  }

  // GM_registerMenuCommand('控制面板', initControlPanel)

  const initData = () => {
    let value = JSON.parse(localStorage.getItem('netToolsData'))
    if (!value) {
      value = {
        checked: getDefaultCheckValue()
      }
    }
    data = value

    function getDefaultCheckValue() {
      const result = []
      for (const key in module) {
        result.push({
          name: module[key].name,
          key,
          checked: module[key].checked,
          children: module[key].children.map(item => ({name: item.name, key: item.key, checked: item.checked}))
        })
      }
      return result
    }
  }

  function initModule() {
    const host = location.host

    for (const key in module) {
      const {checked, children} = module[key]
      if (host.includes(key)) {
        if (!checked) {
          return
        } else {
          const childrenModule = children.find(item => host.includes(item.key) && item.checked)
          return childrenModule && childrenModule.run()
        }
      }
    }
  }

  function initControlPanel() {
    const control = createControlPanel()


    const style = `
      <style>
        #control-panel{ 
          display: none;
          padding: 10px; 
          position: fixed; 
          top: 50%;
          left: 50%;
          background: white;
          transform: translate(-50%, -50%);
          z-index: 99999;
          box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
          border-radius: 4px;
          color: #606266
        }
        .control-panel-save{
          cursor: pointer;
          margin-top: 20px;
          float: right;
        }
        .control-panel-close{
          cursor: pointer;
          float: right;
        }
      </style>`
    $('body').append(control).append(style)

    $('.control-panel-close').click(controlPanel.hidden)
    $('.control-panel-save').click(controlPanel.save)
    controlPanel.status = 1
    controlPanel.show()

    function createControlPanel() {
      const menu = []
      for (const key in module) {
        menu.push({
          name: module[key].name,
          key: key,
          children: module[key].children.map(item => ({name: item.name, key: item.key}))
        })
      }

      return (`
        <div id="control-panel">
           <div class="control-panel-close"> X </div>
        ${createSelect()}
           <div class="control-panel-save">保存</div>
        </div>
      `)
    }

    function createSelect() {
      return data.checked.map(item =>
        `<div>
          ${getCheck(item.name, 0)}
          </br>
          ${item.children.map(item => getCheck(item.name, 1)).join('')}
       </div>`
      ).join('')
    }

    function getCheck(str, level) {
      return `
        <label class="el-checkbox is-checked" style="padding-left: ${18 * level}px;">
          <span class="el-checkbox__input is-checked">
            <input class="el-checkbox__original" type="checkbox">
            <span class="el-checkbox__inner"></span>
          </span>
          <span class="el-checkbox__label">${str}</span>
        </label>
      `
    }
  }

  ;(function () {
    initData()
    initModule()
  })()
})()
