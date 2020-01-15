module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dbPath", function() { return dbPath; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_electron_updater__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_electron_updater___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_electron_updater__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_request__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_request___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_request__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_os__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_os___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_os__);









var docDir = __WEBPACK_IMPORTED_MODULE_3_path___default.a.join(__WEBPACK_IMPORTED_MODULE_5_os___default.a.homedir(), 'iConfig');
var dbPath = __WEBPACK_IMPORTED_MODULE_3_path___default.a.join(docDir, 'data.sqlite3');
var dbStatus = 0;

if (__WEBPACK_IMPORTED_MODULE_2_fs___default.a.existsSync(dbPath)) {
  console.log('文件已经存在了');
} else {
  __WEBPACK_IMPORTED_MODULE_2_fs___default.a.mkdir(docDir, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("目录创建成功。");
  });
}
var url = "http://10.165.29.212:8009/syn/remoteSyn/12.0";
var stream = __WEBPACK_IMPORTED_MODULE_2_fs___default.a.createWriteStream(dbPath);

__WEBPACK_IMPORTED_MODULE_4_request___default()(url).pipe(stream).on('close', function () {
  dbStatus = 1;
  console.log('数据库更新成功：：：');
});

if (process.env.NODE_ENV !== 'development') {
  global.__static = __webpack_require__(2).join(__dirname, '/static').replace(/\\/g, '\\\\');
}

var mainWindow = void 0;
var winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : 'file://' + __dirname + '/index.html';

function createWindow() {
  var size = __WEBPACK_IMPORTED_MODULE_0_electron__["screen"].getPrimaryDisplay().workAreaSize;
  var width = parseInt(size.width * 0.9);
  var height = parseInt(size.height * 0.9);

  mainWindow = new __WEBPACK_IMPORTED_MODULE_0_electron__["BrowserWindow"]({
    frame: true,
    useContentSize: true,
    width: width,
    height: height,
    minWidth: 1200,
    minHeight: 550,
    show: false,
    type: 'hiddenInset' });

  __WEBPACK_IMPORTED_MODULE_0_electron__["Menu"].setApplicationMenu(null);
  mainWindow.loadURL(winURL);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('ready-to-show', function () {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.closeDevTools();
}

__WEBPACK_IMPORTED_MODULE_0_electron__["app"].on('ready', function () {
  if (process.env.NODE_ENV === 'production') __WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].checkForUpdatesAndNotify();

  createWindow();
});

__WEBPACK_IMPORTED_MODULE_0_electron__["app"].on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    __WEBPACK_IMPORTED_MODULE_0_electron__["app"].quit();
  }
});

__WEBPACK_IMPORTED_MODULE_0_electron__["app"].on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

__WEBPACK_IMPORTED_MODULE_0_electron__["ipcMain"].on('download', function (event, downloadPath) {
  mainWindow.webContents.downloadURL(downloadPath);
  mainWindow.webContents.session.once('will-download', function (event, item) {
    item.once('done', function (event, state) {
      mainWindow.webContents.send('downstate', state);
    });
  });
});

function sendUpdateMessage(message, data) {
  mainWindow.webContents.send('update-message', { message: message, data: data });
}

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].autoInstallOnAppQuit = false;

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].on('error', function (data) {
  sendUpdateMessage('error', data);
});

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].on('checking-for-update', function (data) {
  sendUpdateMessage('checking-for-update', data);
});

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].on('update-available', function (data) {
  sendUpdateMessage('update-available', data);
});

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].on('update-not-available', function (data) {
  sendUpdateMessage('update-not-available', data);
});

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].on('download-progress', function (data) {
  sendUpdateMessage('download-progress', data);
});

__WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].on('update-downloaded', function () {
  sendUpdateMessage('update-downloaded', {});
  __WEBPACK_IMPORTED_MODULE_0_electron__["ipcMain"].once('update-now', function () {
    __WEBPACK_IMPORTED_MODULE_1_electron_updater__["autoUpdater"].quitAndInstall();
  });
});
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src\\main"))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(1);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


process.env.NODE_ENV = 'development';

__webpack_require__(5)({ showDevTools: true });

__webpack_require__(0).app.on('ready', function () {
  var installExtension = __webpack_require__(6);
  installExtension.default(installExtension.VUEJS_DEVTOOLS).then(function () {}).catch(function (err) {
    console.log('Unable to install `vue-devtools`: \n', err);
  });
});

__webpack_require__(1);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("electron-debug");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("electron-devtools-installer");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("electron-updater");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ })
/******/ ]);