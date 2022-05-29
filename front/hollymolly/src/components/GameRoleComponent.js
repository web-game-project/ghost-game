import React, { useEffect, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//이미지
import gameBackground from '../assets/night.png';

// 소켓
import { io, Socket } from 'socket.io-client';
import GameStart from '../screens/GameStart';

//인간, 유령
import { ReactComponent as HumanCharacter } from '../assets/human.svg';
import { ReactComponent as GhostCharacter } from '../assets/purple.svg';
import colors from '../styles/styles';

function GameRoleComponent(props) {

    const ghost = "친구들과 수다를 떨고 있는 Holly!\n그런데.. 동작 그만! 자꾸 생뚱맞은 이야기를 하는 너, \n대체 누구야?\n아무리 봐도 지금 우리 사이에 인간이 들어 온 것 같다!\n 겁없이 우리 세계로 들어온 몰리를 찾아 혼쭐을 내주자.\n동안 친구들과 함께 최선을 다해서 \n몰리를 찾아보자구!";
    const human = "공포영화를 보다가 잠에 빠진 Molly!\n눈 떠보니 홀리세계라고?\n을 들키지 않고 지내야\n 원래 세계로 돌아가는 길이 열린다.\n이 홀리들 수다떠는 걸 엄청 좋아하는데\n그 사이에서 몰리라는 존재를 들키지 않아야 산다.\n한 번 홀리인척을 열심히 해보자구!";

    //게임 시작 5초 후, 타이머 -> 10초로 변경
    const [seconds, setSeconds] = useState(10);

    //let timer = 5;
    useEffect(() => {
        //console.log('넘어온 게임 세트 인덱스_gamerole' + props.role);
        ///timer = props.timer;

        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }
        }, 1000);

        return () => {
            clearInterval(countdown); 
        } ;
    }, [seconds]);

    return (
        <Container>
            <SubContainer>                
                {
                    props.role == "human" ?                        
                    <RoleContainer>
                           
                            <RoleImg>
                                <HumanCharacter className="ghost" width="80" height="117" />
                            </RoleImg>

                            <RoleTitle role="human" color={style.red}> 몰리 </RoleTitle>
                            
                            <RoleContent role="human">
                                {human.split("\n").map((i, key) => {
                                  if (key !== 2)
                                        return <text key={key}> {i}</text>;
                                    else
                                        return <p key={key}><RoleTxt color={style.red}>3일</RoleTxt>{i}</p>;
                                })}
                            </RoleContent>

                            <RoleKeyword>* 왼쪽 상단에 있는 키워드 확인 필수 *</RoleKeyword>

                        </RoleContainer>
                        :
                        <RoleContainer>

                            <RoleImg>
                                <GhostCharacter className="ghost" width="80" height="117" />
                            </RoleImg>

                            <RoleTitle role="ghost" color={style.blue}> 홀리 </RoleTitle>
                            
                            <RoleContent role="ghost" >
                                {ghost.split("\n").map((i, key) => {
                                  if (key !== 5)
                                        return <text key={key}> {i}</text>;
                                    else
                                        return <p key={key}><RoleTxt color={style.red}>3일 </RoleTxt>{i}</p>;
                                })}
                            </RoleContent>

                            <RoleKeyword>* 왼쪽 상단에 있는 키워드 확인 필수 *</RoleKeyword>

                        </RoleContainer>
                }

                <TimerBtnContainer>{seconds}초 후 시작</TimerBtnContainer>
            </SubContainer>
        </Container>

    );
}

const RoleKeyword = styled.div`
    width: 100%;
    font-size: 16px;
    color: #ff0000;
    font-weight: 600;
    margin-top: 20px;
`;
const Container = styled.div`
    width: 480px;
    height: 500px;
    margin-top: 60px;
    border-width: thin;
    border-radius: 10px;
    border-color: #000000;
    border-style: solid;
    background-color: #ffffff;
`;

const SubContainer = styled.div`
    width: 420px;
    height: 400px;
    padding: 5px;
    margin-left: 20px;
    margin-top: 20px;    
`;

const TimerBtnContainer = styled.div`
    width: 130px;
    height: 30px;
    margin-top: 5px;
    margin-left: 300px;   
    font-size: 20px;
    background-color: #fff;
    text-align: center;
    border-width: 1px;
    border-radius: 15px;
    border-color: #000;    
    border-style: solid;
    margin-bottom: 20px;
`;

const RoleContainer = styled.div`
    width: 100%;
    font-size: 23px;
    display: flex;  
    flex-direction: column;  
    
    p{
        margin-top: 5px;
        margin-bottom: 0px;
        white-space: nowrap;
    }
`;

const RoleTxt = styled.text`
    font-size: 24px;
    color: ${(props) => (props.color)};
`;

const RoleImg = styled.div `
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    .ghost {
        animation: motion 1.5s linear 0s infinite;
        margin-bottom: 0;
    }
`;

const RoleTitle = styled.div`
    text-align: center;   
    color: ${(props) => (props.color)};
    ${(props) => (props.role) === 'ghost' ? ` margin-top: 15px;` : ` margin-top: 20px;`}
`;

const RoleContent = styled.div`
    width: 100%;
    display: flex;     
    flex-direction: column;    
   
    ${(props) => (props.role) === 'ghost' ? `font-size: 20px; margin-top : 20px;` 
            : `font-size: 21px; margin-top : 30px; `}

    text{
        margin-top: 5px;
     }
`;

export default GameRoleComponent;