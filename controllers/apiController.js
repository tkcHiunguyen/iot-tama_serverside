const {connection} = require('../DB')
let get_all_user = async (req, res) => {
    try {
        const [row] = await connection.execute("SELECT * FROM account");
        res.status(200).json(row);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



module.exports = {
    get_all_user,
};