import {app, BrowserWindow, ipcMain, Menu, screen, session} from 'electron';
import {autoUpdater} from 'electron-updater';


//=====================================数据库处理=====================================================
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import request from 'request'
import os from "os";

// 将数据存至系统用户目录，防止用户误删程序
const docDir = path.join(os.homedir(), 'iConfig');
export const dbPath = path.join(docDir, 'data.sqlite3');

// 数据库版本文件路径
const versionPath = path.join(docDir, 'db.version');

// 数据库版本信息
let dbVersionPath = '';

// 更新数据库url
let url = "http://172.31.2.182:8009/syn/remoteSyn/";

console.log('查看版本文件是否存在：：：',fs.existsSync(versionPath));
if (fs.existsSync(versionPath)) {
    fs.readFile(versionPath,'utf8',function(err,data){
        if(err){
            console.log('读取数据库版本文件出错',err)
        }else{
            console.log('读取数据库版本文件信息：：：',JSON.parse(data).dbVersion);
            dbVersionPath = JSON.parse(data).dbVersion;
            updateDB();
        }
    })
}else {
    dbVersionPath = '000.0000000';
    updateDB()
}

function updateDB(){
    // 检查数据库版本信息  code 1000 不需要更新 2000 可以更新 0 程序出错
    axios.get(url + dbVersionPath,
        {timeout: 3000, 'Content-Type': 'application/json'})
        .then((res) => {
            console.log('检查更新数据库结果：：：',res.data);
            if (res.data.status == '2000') {
                // 数据库有更新的时候  如果文件不存在则创建文件
                if (fs.existsSync(dbPath)) {
                    console.log('文件已经存在了')
                } else {
                    fs.mkdir(docDir, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("目录创建成功。");
                    });
                }
                let stream = fs.createWriteStream(dbPath);
                dbVersionPath = res.data.msg;
                request(url).pipe(stream).on('close', function () {
                    console.log('数据库更新成功,写版本文件方法：：：');
                    //修改数据库version写入json文件
                    fs.writeFile(versionPath, '{"dbVersion":"'+dbVersionPath+'"}', error => {
                        if (error)
                            return console.log("写入文件失败,原因是" + error.message);
                        console.log("写入成功");
                    });
                });
            }
        }).catch((error) => {
            console.log(error);
        });
}
//=====================================end=====================================================

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static/').replace(/\\/g, '\\\\');
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:9080'
    : `file://${__dirname}/index.html`;

function createWindow() {
    let size = screen.getPrimaryDisplay().workAreaSize;
    let width = parseInt(size.width * 0.9);
    let height = parseInt(size.height * 0.9);
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({ // 创建窗口实例
        frame: true, // 是否要边框
        useContentSize: true,
        width: width,//1500, // 1366
        height: height,//768,
        minWidth: 1200,//1500,
        minHeight: 550,
        show: false, // 监听加载完毕后显示页面，避免白屏
        type: 'hiddenInset', // 样式
        webPreferences: {
            webSecurity: false
        }
    });
    // 隐藏菜单栏
    Menu.setApplicationMenu(null);
    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // 加载好html再呈现window，避免白屏
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.focus();
    });

    // mainWindow.webContents.openDevTools({ detach: true });
    mainWindow.webContents.closeDevTools();
    // mainWindow.webContents.openDevTools();



    /*// 避免开启多个客户端窗口
    let iShouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
        mainWindow.show();
        mainWindow.focus();
        return true;
    });

    // 如果已经有窗口存在
    if (iShouldQuit) {
        app.quit();
        return;
    }*/
}

app.on('ready', () => {
    if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdatesAndNotify();
    createWindow();
    BindIpc();
});


function BindIpc() {
    /*系统操作事件*/
    ipcMain.on('system',(event,type,data)=>{
        console.log('调用主方法中的更新方法：：',type,data)
        switch (type) {
            case 'check-for-update':/*检查更新*/
                autoUpdater.setFeedURL(data);
                autoUpdater.checkForUpdates();
                CheckUpdate(event);
                break;
            case 'update':/*安装更新*/
                console.log('调用主进程安装：：：：')
                autoUpdater.quitAndInstall();
                break;
        }
    });
}


function CheckUpdate(event){
    let message={
        appName:'iConfig',
        error:'检查更新出错, 请联系开发人员',
        checking:'正在检查更新……',
        updateAva:'检测到新版本，正在下载……',
        updateNotAva:'现在使用的就是最新版本，不用更新',
        downloaded: '最新版本已下载，点击安装进行更新'
    };
    //当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', function() {
        console.log('主进程检查更新：：：',message.checking)
        event.sender.send('check-for-update',message.checking);//返回一条信息
    });
    //当发现一个可用更新的时候触发，更新包下载会自动开始
    autoUpdater.on('update-available', function(info) {
        event.sender.send('update-down-success', info);
        event.sender.send('check-for-update',message.updateAva);//返回一条信息
    });
    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', function() {
        console.log('主进程没有可用更新：：：',message.updateNotAva)
        event.sender.send('check-for-update',message.updateNotAva);//返回一条信息
    });
    autoUpdater.on('error', function(){
        event.sender.send('check-for-update',message.error);//返回一条信息
    });
    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj)=>{
        console.log('主进程下载进度：：：：',progressObj)
        event.sender.send('download-progress',progressObj)
    });
    autoUpdater.on('update-downloaded',  function () {
        event.sender.send('check-for-update',message.downloaded);//返回一条信息
        //通过main进程发送事件给renderer进程，提示更新信息
    });
}
