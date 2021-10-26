const { GameSet, Game, Keyword } = require('../../models');
const moveRoom = require('../../socket/moveRoom');

module.exports = async (req, res, next) => {
    try {
        const { game_set_idx, game_set_human_answer } = req.body;

        // 인간인지 아닌지 체크
        if (res.locals.role != 'human') {
            res.status(403).json({ meesage: '권한이 없습니다.' });
            return;
        }

        // 인간 제시어 입력
        const gameSet = await GameSet.findOne({
            include: [
                {
                    model: Keyword,
                    as: 'keyword_keyword_idx_Keyword',
                    required: true,
                },
            ],
            where: { game_set_idx },
        });
        if (!gameSet) {
            res.status(400).json({
                meesage: '알 수 없는 에러가 발생했습니다.',
            });
            return;
        }

        // add human score
        const humanScore =
            game_set_human_answer ==
            gameSet.get('keyword_keyword_idx_Keyword').get('keyword_child')
                ? gameSet.get('game_set_no')
                : 0;
        
        await GameSet.update(
            {
                game_set_human_answer,
                game_set_human_score: humanScore,
            },
            {
                where: { game_set_idx },
            }
        );

        // room 번호 찾기
        const game = await Game.findOne({
            attributes: ['room_room_idx'],
            where: {
                game_idx: gameSet.game_game_idx,
            },
        });

        // 소켓 submit mafia answer , mafia_submit:true
        const io = req.app.get('io');
        io.to(game.get('room_room_idx')).emit('submit human answer', {
            mafia_submit: true,
        });

        res.status(201).json({});
    } catch (error) {
        console.log(error);
        res.status(400).json({ meesage: '알 수 없는 에러가 발생했습니다.' });
    }
};