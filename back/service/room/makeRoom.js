const { Room, WaitingRoomMember } = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const makeRandomCode = require('../../util/makeRandomCode');

module.exports = async (req, res, next) => {
    try {
        const { room_name, room_mode, room_private, room_start_member_cnt } =
            req.body;
        const user = res.locals.user;

        // room create
        let roomCode;
        let duplicatedRoomCode;
        do {
            roomCode = makeRandomCode(7);
            duplicatedRoomCode = await Room.findOne({
                where: { room_code: roomCode },
            });
        } while (duplicatedRoomCode);

        const room = await Room.create({
            room_code: roomCode,
            room_name,
            room_mode,
            room_private,
            room_start_member_cnt,
            room_status: 'waiting',
        });

        // waitingroommeber create
        const member = await WaitingRoomMember.create({
            wrm_user_color: 0,
            wrm_leader: 1,
            wrm_user_ready: 0,
            room_room_idx: room.room_idx,
            user_user_idx: user.user_idx
        })

        // roomJoin
        moveRoom(req, res, 0, room.room_idx);

        // 대기실 리스트 보는 사람들에게 socket event 전송
        if(!room.room_private){
            const io = req.app.get('io');
            io.to(0).emit('create room', {
                room_name: room.room_name,
                room_mode: room.room_mode,
                room_private: room.room_private,
                room_start_member_cnt: room.room_start_member_cnt,
                room_current_member_cnt: 1,
                room_status: room.room_status,
            });
        }
        
        res.status(201).json({ room_idx: room.room_idx });
    } catch (error) {
        console.log(error);
        res.status(400).json({message:"알 수 없는 오류가 발생했습니다."});
    }
};
