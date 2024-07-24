import mysql.connector
import json
from datetime import datetime
import pandas as pd

# Thiết lập kết nối tới MySQL
def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='skybot@2023',
        database='tama-iot',
        port=3306
    )

# Hàm lưu dữ liệu vào cơ sở dữ liệu
def save_to_database(connection, data):
    insert_query = '''
        INSERT INTO data_sensor (code, machineID, current, clienttime, status, uuid)
        VALUES (%s, %s, %s, %s, %s, %s)
    '''
    
    try:
        cursor = connection.cursor()
        cursor.execute(insert_query, (
            data['code'],
            data['machineID'],
            data['current'],
            data['clienttime'],
            data['status'],
            data['uuid']
        ))
        connection.commit()
        print('Data saved to database.')
    except mysql.connector.Error as err:
        if err.errno == mysql.connector.errorcode.ER_DUP_ENTRY:
            print('Data already exists in database.')
        else:
            print(f'Failed to save data to database: {err}')
    finally:
        cursor.close()

# Hàm xử lý file và lưu dữ liệu vào cơ sở dữ liệu
def process_file_and_save_to_database(file_path, connection):
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()
            for line in lines:
                if line.strip():  # Bỏ qua dòng trống
                    data = json.loads(line.strip())
                    
                    # Chuyển đổi định dạng thời gian nếu cần thiết
                    try:
                        data['clienttime'] = datetime.strptime(data['clienttime'], '%m/%d/%Y %H:%M:%S').strftime('%Y-%m-%d %H:%M:%S')
                    except ValueError as e:
                        print(f"Error parsing date: {e}")
                    
                    save_to_database(connection, data)
    except Exception as e:
        print(f'Failed to process file: {e}')

# Main function
def main():
    file_path = 'data_log.txt'  # Thay thế bằng đường dẫn thực tế tới file dữ liệu của bạn
    connection = get_db_connection()
    process_file_and_save_to_database(file_path, connection)
    connection.close()

if __name__ == "__main__":
    main()
