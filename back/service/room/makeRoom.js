const { Room, WaitingRoomMember } = require('../../models');
const moveRoom = require('../../socket/moveRoom');
const getIOSocket = require('../../socket/getIOSocket');
const makeRandomCode = require('../../util/makeRandomCode');
const { exitGameAndRoom } = require('../game/exitGame');

module.exports = async (req, res, next) => {
    try {
        const { room_name, room_mode, room_private, room_start_member_cnt } =
            req.body;
        const user = res.locals.user;
        const { io, socket } = getIOSocket(req, res);
        console.log("*****", socket.id);

        const beforeWaitingRoomMember = await WaitingRoomMember.findOne({
            where: {
                user_user_idx: user.user_idx,
            },
        });
        if (beforeWaitingRoomMember) await exitGameAndRoom(user, io);

        let roomCode = await makeRoomCode();
        const room = await Room.create({
            room_code: roomCode,
            room_name,
            room_mode,
            room_private,
            room_start_member_cnt,
            room_status: 'waiting',
        });
        await WaitingRoomMember.create({
            wrm_user_color: 'RED',
            wrm_leader: true,
            wrm_user_ready: false,
            room_room_idx: room.room_idx,
            user_user_idx: user.user_idx,
        });

        // socket : get socket
        if (!io || !socket) {
            //console.log("*****", io, socket.id);
            res.status(400).json({
                message: 'socket connection을 다시 해주세요.',
            });
            return;
        }
        // socket : join room room_idx
        moveRoom(io, socket, room.room_idx);

        // 대기실 리스트 보는 사람들에게 socket event 전송
        if (!room.room_private) {
            const io = req.app.get('io');
            io.to(0).emit('create room', {
                room_idx: room.room_idx,
                room_name: room.room_name,
                room_mode: room.room_mode,
                room_start_member_cnt: room.room_start_member_cnt,
                room_current_member_cnt: 1,
                room_status: room.room_status,
            });
        }

        res.status(201).json({
            room_idx: room.room_idx,
            room_code: room.room_code,
        });
    } catch (error) {
        console.log("[makeRoom]",error);
        res.status(400).json({ message: '알 수 없는 오류가 발생했습니다.' });
    }
};

const makeRoomCode = async () => {
    let roomCode;
    let duplicatedRoomCode;
    do {
        roomCode = makeRandomCode(7);
        duplicatedRoomCode = await Room.findOne({
            where: { room_code: roomCode },
        });
    } while (duplicatedRoomCode);
    return roomCode;
};

const exitRoom = async (io, roomMember, roomIdx) => {
    try {
        await WaitingRoomMember.destroy({
            // exit room
            where: { user_user_idx: userIdx, room_room_idx: roomIdx },
        });

        let memberCount = getMemberCount(roomIdx);
        if (memberCount < 1) {
            // delete room
            await Room.destroy({ where: { room_idx: roomIdx } });
            io.to(0).emit('delete room', { room_idx: roomIdx });
        } else {
            if (roomMember.get('wrm_leader')) {
                // change host
                const newLeader = await WaitingRoomMember.findOne({
                    attributes: ['user_user_idx'],
                    where: { room_room_idx: roomIdx },
                    order: sequelize.literal('rand()'),
                });
                await WaitingRoomMember.update(
                    {
                        wrm_leader: true,
                    },
                    {
                        where: {
                            user_user_idx: newLeader.get('user_user_idx'),
                            room_room_idx: roomIdx,
                        },
                    }
                );
                io.to(roomIdx).emit('change host', { user_idx: newLeaderIdx });
            }

            // 방 member count 변경
            await Room.update(
                {
                    room_current_member_cnt: memberCount,
                },
                { where: { room_idx: roomIdx } }
            );
            io.to(0).emit('change member count', {
                room_idx: roomIdx,
                room_member_count: memberCount,
            });
        }
    } catch (error) {
        console.log('makeRoom-방 퇴장 중 에러 발생', error); //게임 시작한 경우 에러 발생 가능
    }
};

const getMemberCount = async (roomIdx) => {
    const member = await WaitingRoomMember.findAll({
        attributes: [
            [sequelize.fn('count', sequelize.col('wrm_idx')), 'memberCount'],
        ],
        where: {
            room_room_idx: roomIdx,
        },
    });

    let { memberCount } = member[0].dataValues;

    return memberCount;
};