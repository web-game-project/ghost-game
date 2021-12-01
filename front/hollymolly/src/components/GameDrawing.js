import React, { createRef, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import style from '../styles/styles';
import RefreshVerification from '../server/RefreshVerification';

//RefreshVerification.verification();

import html2canvas from 'html2canvas';

let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

const socket = io('http://3.17.55.178:3002/', {
    auth: {
        token: save_token,
        // 3번 토큰 edge
        //token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MywidXNlcl9uYW1lIjoiaHkiLCJpYXQiOjE2MzI4MzMwMTd9.-i36Z3KoqzCfgtVNl1-c8h5fZNSZ8Nlhnp4UI41tFxM"
        // 8번 토큰
        //token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6OCwidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.Q6DBbNtwXRnhqfA31Z_8hlnXpN6YjN0YQXFEoypO7Mw',
    },
});

socket.on('connect', () => {
    console.log('game drawing connection server');
});

const GameDrawing = (props) => {
    const {order, color, room_idx, idx, member_count} = props;

    const [possible, setPossible] = useState(true);
    const [seconds, setSeconds] = useState(10); // 그림 그리기 타이머
    const [waitSeconds, setWaitSeconds] = useState(-1); // 순서 받기 타이머, 그림 다 그린 후 타이머 실행되야 하므로 일단 -1 으로 초기화
    const [readyNextOrder, setReadyNextOrder] = useState(false); // 다음 순서 준비 완료 소켓 값을 관리하는 상태 값
    const [reDraw, setReDraw] = useState(false); // 다시 그리기 위해 canvas 관리하는 상태 값

    const orderCount = useRef(1); // orderCount
    const drawingTime = useRef(true); // 그릴 수 있는 시간을 관리하는 변수

    // ** 넘어온 props 값 & save_token 값으로 바꾸기
    let user_order = parseInt(order);
    let user_color = color; // RED, ORANGE, YELLOW, GREEN, BLUE, PINK, PURPLE 
    let user_room_index = parseInt(room_idx);
    let user_idx = parseInt(idx);
    let user_member_count = parseInt(member_count);
    // **
    
    //8번
   /*  let user_order = 1;
    let user_color = 'RED'; // RED, ORANGE, YELLOW, GREEN, BLUE, PINK, PURPLE
    let user_room_index = 53;
    let user_idx = 8;
    let user_member_count = 2; */

    let canvas;
    let canvasRef = createRef();

    let pos = {
        drawable: false,
        X: -1,
        Y: -1,
    };

    let oldPos = {
        X: -1,
        Y: -1,
    };

    let ctx;

    useEffect(() => {
        canvas = canvasRef.current;
        ctx = canvas.getContext('2d');

        // DEFAULT 스타일 값 지정
        ctx.strokeStyle = user_color;
        ctx.lineWidth = 3;

        canvas.addEventListener('mousedown', initDraw); // 그림 그리기 시작
        canvas.addEventListener('mousemove', draw); // 그림 그리기
        canvas.addEventListener('mouseup', finishDraw); // 그림 그리기 종료
        canvas.addEventListener('mouseout', finishDraw); // 그림 그리기 종료
    }, [reDraw]);

    // 초기 세팅
    function initDraw(event) {
        if (orderCount.current === user_order && drawingTime.current) {
            // 자기 순서 일때만 그리기 // props.order
            ctx.beginPath();
            pos = { drawable: true, ...getPosition(event) };
            ctx.moveTo(pos.X, pos.Y);
            oldPos = { X: pos.X, Y: pos.Y };
        }
    }

    // 그림 그리는 중
    function draw(event) {
        if (pos.drawable) {
            pos = { ...pos, ...getPosition(event) };
            ctx.lineTo(pos.X, pos.Y);
            ctx.stroke();

            // 실시간으로 그림 좌표 계속 전송
            socket.emit('draw', {
                room_idx: user_room_index, // props.room_idx
                draw_info: {
                    color: ctx.strokeStyle,
                    previous_x: oldPos.X,
                    previous_y: oldPos.Y,
                    current_x: pos.X,
                    current_y: pos.Y,
                },
            });

            oldPos = { X: pos.X, Y: pos.Y };
        }
    }

    // 그림 그리기 종료
    function finishDraw() {
        pos = { drawable: false, X: -1, Y: -1 };
    }

    function getPosition(event) {
        return { X: event.offsetX, Y: event.offsetY };
    }

    useEffect(() => {
        socket.on('draw', (data) => {
            // 그림 좌표 받기
            // 자기 순서가 아니면 받은 그림 좌표 그려주기
            if (orderCount.current !== user_order) {
                // props.order
                ctx.strokeStyle = data.color;
                ctx.beginPath();
                ctx.moveTo(data.previous_x, data.previous_y);
                ctx.lineTo(data.current_x, data.current_y);
                ctx.stroke();
            }
        });

        socket.on('get next turn', (data) => {
            // 그림 좌표 받기
            console.log(data.message); // success 메시지
            setReadyNextOrder(true);
            //setReDraw(false);
        });
    }, []);

    // 그림 그리기 타이머
    useEffect(() => {
        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            } else if (parseInt(seconds) === 0) {
                // 타이머 종료,
                console.log('그림 그리기 시간 끝');

                // 순서 증가 
                orderCount.current += 1;

                drawingTime.current = false; // 그림 그리기 시간 끝
                setPossible(false);
                if (orderCount.current === user_member_count) {
                    clearInterval(countdown);
                    console.log('모든 순서 끝!');
                    //세트 이미지 저장 api 요청

                    //여기서 투표로 넘어가기
                } else {
                    // 다음 순서 받을 준비 완료
                    socket.emit('send next turn', {
                        room_idx: user_room_index,
                        user_idx: user_idx,
                        member_count: user_member_count,
                        draw_order: orderCount.current
                    });

                    // 다음 순서 받을 준비 완료 소켓 보내고 3초 시간 잼
                    setWaitSeconds(3);
                    //여기야, 내가 바꾼 코드
                    setSeconds(-1);
                    setPossible(false);
                }
            }
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, [seconds]);

    // 순서 받기 타이머
    useEffect(() => {
        const waitcountdown = setInterval(() => {
            if (parseInt(waitSeconds) > 0) {
                setWaitSeconds(parseInt(waitSeconds) - 1);
            } else if (parseInt(waitSeconds) === 0) {
                // 3초가 지나도 받지 못하면 네트워크 에러 및 서버에서 강제 퇴장 처리

                if (readyNextOrder) {
                    console.log('다음 순서 받기');
                    setWaitSeconds(-1);
                    setReadyNextOrder(false); // 다시 다음 순서 받을 준비
                    //orderCount.current += 1; // 순서 바꾸기
                    setReDraw(!reDraw); // 그리기 준비
                    drawingTime.current = true;
                    setPossible(true);
                    setSeconds(10);
                } else {
                    console.log('순서 받기 시간 끝');
                    console.log('네트워크가 불안정합니다.');

                    setWaitSeconds(-1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(waitcountdown);
        };
    }, [waitSeconds]);

    const onClick = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // 그림 초기화
    };

    //downloadURI, Save 는 지울 예정 정희
    function downloadURI(uri, name){
        var link = document.createElement("a")
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
    }

    const Save = () => {
        const canvas = document.getElementById('draw');
        
        const imgBase64 = canvas.toDataURL('image/png', 'image/octet-stream');
        /* const decodImg = atob(imgBase64.split(',')[1]);
      
        let array = [];
        for (let i = 0; i < decodImg .length; i++) {
          array.push(decodImg .charCodeAt(i));
        }
      
        const file = new Blob([new Uint8Array(array)], {type: 'image/png'});
        const fileName = 'canvas_img_' + new Date().getMilliseconds() + '.png';
        let formData = new FormData();
        formData.append('file', file, fileName); */

        downloadURI(imgBase64, "예스")
    }

    let ImgUrl; //타이머 이미지 URL이 들어갈 곳

    return (
        <React.Fragment>
            {/* 그림그리기 시간 : {seconds}
            <br />
            순서 기다리는 시간 : {waitSeconds}
            <br />내 순서 : {user_order}
            <br />내 색깔 : {user_color}
            <br />
            현재 순서 : {orderCount.current} */}
            <Container>                
                <div style={{backgroundColor: style.white, borderRadius: '15px'}}>
                    <canvas id = "draw" ref={canvasRef} width="610" height={'600'}>
                    </canvas>
                </div>
                {
                    (console.log('가능? ' + possible),
                    // possible === true
                    // ?
                    ((ImgUrl = '../assets/timer_' + seconds + '.png'),
                    //dia = "../assets/timer_1.png",
                    console.log('얌? ' + ImgUrl),
                    seconds > 0 ? (
                        <img
                            src={require('../assets/timer_' + seconds + '.png').default}
                            style={{
                                width: '80px',
                                height: '50px',
                                backgroundSize: 'contain',
                                marginTop: '20px',
                                zIndex: '1',
                                marginLeft: '-100px',
                            }}
                        />
                    ) : (
                        ''
                    )))
                    // : ''
                }
            </Container>
            {/* <button onClick={onClick}>초기화</button>
            <button onClick={Save}>저장</button> */}
        </React.Fragment>
    );
};

const TimerSubContainer = styled.div`
    width: 150px;
    height: 150px;
    //${(props) => (props.file !== null ? `background-image: url(${props.file});` : ``)}
    //background-size: contain;
    //background-repeat: no-repeat;
`;

const Container = styled.div`
    background-color: #ffffff;
    width: 610px;
    height: 600px;
    display: flex;
    border-radius: 15px;
    
`;

export default GameDrawing;