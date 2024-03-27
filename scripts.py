# 初始化数据库记录
# 1. 打开 .\backend\trade_master.db 数据库
# 2. 读取 prices.csv 文件内容（index, code, current, time）
# 3. 插入数据库记录

import sqlite3
import csv
import datetime


# 打开数据库连接
conn = sqlite3.connect('backend/trade_master.db')
cursor = conn.cursor()

current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# 清空 stock 数据表
cursor.execute("DELETE FROM stock")
cursor.execute("DELETE FROM account")
cursor.execute("DELETE FROM asset")

# 读取 prices.csv 文件并插入数据库记录
with open('prices.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # 清理每个字段中的空白字符
        cleaned_row = {key.strip(): value.strip() for key, value in row.items()}
        code = cleaned_row['code']
        # current = float(cleaned_row['current'])
        current = cleaned_row['current']
        time = cleaned_row['time']
        cursor.execute("INSERT INTO stock (code, current, time, deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                       (code, current, time, 0, current_time, current_time))

# 新增 account 表记录: id, created_at, updated_at, deleted, name
# [{"created_at": xx, "updated_at": xx, "deleted": 0, "name": xx}, ...]
cursor.execute("INSERT INTO account (created_at, updated_at, deleted, name) VALUES (?, ?, ?, ?)",
               (current_time, current_time, 0, "账户1"))
cursor.execute("INSERT INTO account (created_at, updated_at, deleted, name) VALUES (?, ?, ?, ?)",
               (current_time, current_time, 0, "账户2"))

# 新增 asset 表记录: id, created_at, updated_at, deleted, account_id, aum
cursor.execute("INSERT INTO asset (created_at, updated_at, deleted, account_id, aum) VALUES (?, ?, ?, ?, ?)",
               (current_time, current_time, 0, 1, "1000000"))
cursor.execute("INSERT INTO asset (created_at, updated_at, deleted, account_id, aum) VALUES (?, ?, ?, ?, ?)",
               (current_time, current_time, 0, 1, "300000"))
cursor.execute("INSERT INTO asset (created_at, updated_at, deleted, account_id, aum) VALUES (?, ?, ?, ?, ?)",
               (current_time, current_time, 0, 2, "6666666"))


# 提交更改并关闭连接
conn.commit()
conn.close()

print("数据库初始化完成")
