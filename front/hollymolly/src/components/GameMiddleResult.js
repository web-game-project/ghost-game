import React, { useState, useEffect } from "react";
import styled from "styled-components";
import style from "../styles/styles";
import night from "../assets/night.svg";
import PurpleCharacter from "../assets/purple.svg";
import Human from "../assets/human.svg";
import GameResultCard from "../components/GameResultCard";

const GameMiddleResult = (props) => {
  const { winner } = props;

  const [seconds, setSeconds] = useState(10); //10초 보여주기

  let role = "";
  let engRole = "";
  let draw = false;

  if (winner === "ghost") { // 유령이 이겼을 때 
    role = "홀리";
    engRole = "GHOST";
  } else if (winner === "human") { // 인간이 이겼을 때 
    // human
    role = "몰리";
    engRole = "HUMAN";
  } else { // 동점일 때 
    draw = true;
  }

  useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1);
      }
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [seconds]);

  return (
    <React.Fragment>
      <Container>
      <ResultTitle>중간 &nbsp; 결과</ResultTitle>
      <Timer>{seconds}초 후 넘어갑니다.</Timer>
        {draw ? (
          <CardContainer>
            <GameResultCard role={"유령"} engRole={"GHOST"}></GameResultCard>
            <GameResultCard role={"인간"} engRole={"HUMAN"}></GameResultCard>
          </CardContainer>
        ) : (
          <GameResultCard role={role} engRole={engRole}></GameResultCard>
        )}
        {draw ? (
          <WinnerContext>현재 동점입니다.</WinnerContext>
        ) : (
          <WinnerContext>현재 {role}가 이기고 있습니다.</WinnerContext>
        )}
      </Container>
    </React.Fragment>
  );
};

const Timer = styled.div`
    font-weight: bold;
    font-family: Gowun Dodum;
    font-size: 20px;
    color:${style.white};   
    margin-bottom: 30px;
    margin-top: 20px;
    text-align: center;
`;

const Container = styled.div`
  background-color: transparent; // transparent
  width: 650px;
  height: 620px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardContainer = styled.div`
  background-color: transparent; // transparent
  width: 400px;
  height: 260px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: space-between;
`;

const ResultTitle = styled.text`
  font-size: 60px;
  font-family: Black Han Sans;
  -webkit-text-stroke: 1px #53305e;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e, 6px 6px 0px #53305e,
    7px 7px 0px #2a132e, 8px 8px 0px #2a132e, 9px 9px 0px #2a132e,
    10px 10px 0px #2a132e; //#2A132E
`;

const WinnerContext = styled.text`
  margin-top: 50px;
  font-size: 25px;
  font-family: Gowun Dodum;
  //-webkit-text-stroke: 1px #53305E;
  //font-weight: bold;
  color: #ffffff;
`;

export default GameMiddleResult;