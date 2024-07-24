const moment = require('moment');
const { connection } = require("./DB")


module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A client connected, socket ID:', socket.id);

        socket.on('disconnect', () => {
            console.log('A client disconnected');
        });

        socket.on('readpzem', async (data) => {
            try {
                let ESPData = JSON.parse(data);
                let now = moment();
                let nowdate = now.format("MM-DD-YYYY HH:mm:ss");
                ESPData.nowdate = nowdate;
                let filePath = 'data_log.txt';
                // console.log('Received data:', ESPData);

                let storageData = {};
                storageData.code = ESPData.code
                storageData.machineID = ESPData.machineID;
                storageData.current = ESPData.current;
                storageData.clienttime = ESPData.clienttime;
                storageData.status = ESPData.status;
                storageData.uuid = ESPData.uuid;

                await saveToDatabase(storageData);
                io.emit("check_uuid", ESPData.uuid);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
            }
        });

        socket.on("device_info", (data) => {
            // console.log(data);
            // switch (data) {
            //      case "node_1": {
            //           io.emit("setup_device", device1)
            //      }
            // }
        });
    });
};

async function saveToDatabase(data) {
    const insertQuery = `
        INSERT INTO data_sensor (code, machineID, current, clienttime, status, uuid)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        await connection.execute(insertQuery, [
            data.code,
            data.machineID,
            data.current,
            data.clienttime,
            data.status,
            data.uuid
        ]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('Data already exists in database.');
        } else {
            console.error('Failed to save data to database:', error);
        }
    }
}


