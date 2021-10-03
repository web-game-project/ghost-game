const { WaitingRoomMember } = require('../../models');

module.exports = async (req, res, next) => {
    let { user_ready } = req.body;

    // 토큰 완료되면 header에서 user_idx 받아옴
    let user_idx = 7;
    let { room_idx } = req.body;
    
    try {
        await WaitingRoomMember.update(
            {
                wrm_user_ready: user_ready,
            },
            { where: { user_user_idx: user_idx, room_room_idx: room_idx } }
        );

        const io = req.app.get('io');
        let data = { user_idx, user_ready };
        io.to(room_idx).emit('change member ready', data);

        res.status(200).json('success');
    } catch (error) {
        console.log('***********', error);
    }
};