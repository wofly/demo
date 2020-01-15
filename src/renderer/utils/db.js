/*import fs from 'fs';
import path from 'path';
import sq3 from 'sqlite3';
import main from '../main';
import { docDir } from './settings';*/
// 将数据存至系统用户目录，防止用户误删程序
let db = db;
   /* const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);*/

/*console.log('test3333')
const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
console.log('test4444')*/
/*db.serialize(() => {
  /!**
   * 物品表 GOODS
   * name 品名
   * standard_buy_unit_price 标准进价
   * standard_sell_unit_price 标准售价
   * total_amount 总金额
   * total_count 总数量
   * remark 备注
   * create_time 创建时间
   * update_time 修改时间
   *!/
});*/

export default db;
