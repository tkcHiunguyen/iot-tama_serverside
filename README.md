
# TAMA IOT - Server side (NODEJS)

IOT Machine Monitoring System (IMMS) is a system that monitors machine operation by using Hall sensors to collect data on the electricity consumption of each machine at STS. The system also includes ERROR, UNDER MAINTENANCE, and OPERATIONAL buttons to quickly report machine errors, monitor maintenance, and update directly through STS's FAS error reporting system.

The IMMS operates by collecting data from the sensors, storing it, and periodically reporting it to the management web system through hubs.


## Authors

- [@tkcHiunguyen](https://github.com/tkcHiunguyen)


## Features

- Collects data from all client nodes in the factory using socket.io.

- Processes and packages data using MySQL.

- Stores data on Google Sheets, linked with App Script and AppSheet.

- Utilizes JWT authentication.


## Installation

- Install TAMA IOT server with npm
- Install database with Mysql
    
## Used By

This project is used by the following companies:

- 	SMART TWINE SOLUTIONS JOINT STOCK COMPANY



