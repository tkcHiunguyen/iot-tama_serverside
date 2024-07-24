const fs = require('fs-extra');
const axios = require('axios')
const { connection } = require('../DB')
const { v4: uuidv4 } = require('uuid')
const appscriptURL = "https://script.google.com/macros/s/AKfycbyQWoQK_i1k4Mfx_vy-KYGwLxmJK9FIXuke5Jt6VJrfUQYpco39sqf_OVTHG8EcUgTY/exec"
var lock_connection = false
var uuidAppScript
var dataFrame
async function checkAndSendData() {
    if (lock_connection == false) {
        try {
            lock_connection = true
            uuidAppScript = uuidv4();
            const [rows] = await connection.execute('SELECT * FROM data_sensor LIMIT 100');

            if (rows.length === 0) {
                // console.log('No data to send');
                return;
            }
            dataFrame = {
                uuid: uuidAppScript,
                data: rows
            };
            // console.log(dataFrame)
            await sendToAppScript(dataFrame)
        } catch (error) {
            console.error('Failed to process data:', error);
        }
    }

}
async function sendToAppScript(data) {
    // console.log(data)
    try {
        const response = await axios.post(appscriptURL, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // In ra phản hồi từ máy chủ
        console.log('Data sent successfully');
        console.log('HTTP Response Code:', response.status);

        // Nếu phản hồi từ máy chủ cho biết thành công, xóa các dòng đã gửi
        if (response.data == uuidAppScript) {
            console.log(response.data)
            deleteSentData(dataFrame);
        }
        else {
            console.log("response not match!")
            console.log(response.data)
        }



    } catch (error) {
        // In ra lỗi nếu có
        console.error('Failed to send data:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status); // Mã trạng thái lỗi
            console.error('Response Data:', error.response.data); // Dữ liệu lỗi
        }
    }
    finally {
        lock_connection = false
    }
}
async function deleteSentData(uuidList) {
    try {
        // const uuidsToDelete = dataFrame.data.map(data => data.uuid);
        const uuidsToDelete = uuidList.data.map(uuid => `'${uuid.uuid}'`).join(', ');
        const deleteQuery = `DELETE FROM data_sensor WHERE uuid IN (${uuidsToDelete})`;
        await connection.execute(deleteQuery);
        console.log('Deleted sent data from database.');
    } catch (error) {
        console.error('Failed to delete data from database:', error);
    }
}

// Export hàm để có thể sử dụng từ file khác
module.exports = {
    checkAndSendData
};