module.exports = {
    send: (req, res) => {
        res.json(req.dd || {})
    }
}
