import React from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import night from '../assets/night.svg';
import PurpleCharacter from '../assets/purple.svg';
import Human from '../assets/human.svg';
import GameResultCard from '../components/GameResultCard';

const GameFinalResult = ({ data }) => {
    // 넘어오는 임시 데이터
    // {
    //     one_game_set_human_score: 1,
    //     two_game_set_human_score: 2,
    //     three_game_set_human_score: 0,
    //     total_game_set_human_score: 3,
    //     one_game_set_ghost_score: 1,
    //     two_game_set_ghost_score: 2,
    //     three_game_set_ghost_score: 0,
    //     total_game_set_ghost_score: 4,
    // };

    let winner = '';
    if (data.total_game_set_ghost_score > data.total_game_set_human_score) {
        winner = '유령';
    } else if (data.total_game_set_ghost_score == data.total_game_set_human_score) {
        winner = 'draw';
    } else if (data.total_game_set_ghost_score < data.total_game_set_human_score) {
        winner = '인간';
    }

    console.log(data);
    return (
        <React.Fragment>
            <Container>
                <ResultTitle>최종 &nbsp; 결과</ResultTitle>
                <CardContainer>
                    {winner == '유령' ? (
                        <GameResultCard role={'유령'} engRole={'GHOST'} final win></GameResultCard>
                    ) : (
                        <GameResultCard role={'유령'} engRole={'GHOST'} final></GameResultCard>
                    )}
                    <div>
                        <ScoreTitle>
                            {data.total_game_set_ghost_score} : {data.total_game_set_human_score}
                        </ScoreTitle>
                    </div>
                    {winner == '인간' ? (
                        <GameResultCard role={'인간'} engRole={'HUMAN'} final win></GameResultCard>
                    ) : (
                        <GameResultCard role={'인간'} engRole={'HUMAN'} final></GameResultCard>
                    )}
                </CardContainer>
                <ResultTalbe>
                    <table style={{ width: '300px', height: '100px', fontSize: 23, color: style.white }}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>인간</th>
                                <th>유령</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                style={{
                                    padding: '20px',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <td>첫번째 날</td>
                                <td>{data.one_game_set_human_score}</td>
                                <td>{data.one_game_set_ghost_score}</td>
                            </tr>
                            <tr
                                style={{
                                    padding: '20px',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <td>두번째 날</td>
                                <td>{data.two_game_set_human_score}</td>
                                <td>{data.two_game_set_ghost_score}</td>
                            </tr>
                            <tr
                                style={{
                                    padding: '20px',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <td>세번째 날</td>
                                <td>{data.three_game_set_human_score}</td>
                                <td>{data.three_game_set_ghost_score}</td>
                            </tr>
                            <td colSpan="3">
                                <div
                                    style={{
                                        width: '100%',
                                        justifySelf: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        textAlign: 'center',
                                        borderBottom: '1px solid #aaa',
                                        lineHeight: '0.1em',
                                        margin: '10px 0px 5px 0px',
                                    }}
                                />
                            </td>
                            <tr
                                style={{
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <td></td>
                                <td
                                    style={{
                                        color: '#ffffff',
                                        fontSize: 25,
                                        fontWeight: 'bold',
                                        textShadow: '2px 2px 0px #2a132e',
                                    }}
                                >
                                    {data.total_game_set_human_score}
                                </td>
                                <td
                                    style={{
                                        fontSize: 25,
                                        fontWeight: 'bold',
                                        textShadow: '2px 2px 0px #2a132e',
                                    }}
                                >
                                    {data.total_game_set_ghost_score}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </ResultTalbe>

                {winner == 'draw' ? (
                    <WinnerContext>최종 공동 우승입니다.</WinnerContext>
                ) : (
                    <WinnerContext>
                        최종 우승은 <ResultSubtitle>{winner} </ResultSubtitle>입니다
                    </WinnerContext>
                )}
            </Container>
        </React.Fragment>
    );
};
const ScoreTitle = styled.text`
    font-size: 60px;
    font-weight: bold;
    align-self: center;
    color: #ffffff;
    text-shadow: 5px 5px 0px #2a132e, 5px 5px 0px #2a132e; //#2A132E
    // margin-bottom: 50px;
`;

const Container = styled.div`
    background-color: transparent;
    width: 650px;
    height: 620px;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    margin-top: 25px;
    overflow: hidden;
`;

const CardContainer = styled.div`
    background-color: transparent;
    width: 500px;
    height: 220px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const ResultTitle = styled.text`
    font-size: 55px;
    font-family: Black Han Sans;
    -webkit-text-stroke: 1px #53305e;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e, 6px 6px 0px #53305e, 7px 7px 0px #2a132e, 8px 8px 0px #2a132e,
        9px 9px 0px #2a132e, 10px 10px 0px #2a132e; //#2A132E
    margin-bottom: 20px;
`;

const ResultSubtitle = styled.text`
    font-size: 40px;
    font-family: Hahmlet;
    -webkit-text-stroke: 1px ${style.yellow};
    font-weight: bold;
    color: ${style.yellow};
    text-shadow: 4px 4px 0px #53305e, 7px 7px 0px #2a132e; //#2A132E
`;

const ResultTalbe = styled.div`
    background-color: transparent;
    border-radius: 2rem;
    width: 330px;
    height: 190px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const WinnerContext = styled.text`
    font-size: 25px;
    font-family: Gowun Dodum;
    color: #ffffff;
`;

export default GameFinalResult;