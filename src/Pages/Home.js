import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import UserContext from "../context/UserContext";

function Home() {


  const { value, setValue } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState();
  const [size, setSize] = useState(12);

  const navigate = useNavigate();
  const elementRef = useRef(null);

  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      fetchList();
    }
  }

  function navigateAndId(id) {
    navigate(`/user/${id}`);
    setValue({ id: id });
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [users]);

  async function fetchList() {
    try {
      const response = await fetch(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${page}/${size}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      if (data.list.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...data.list]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <HomePageContainer>
      <Container>
        {users?.map(({ id, name, lastName, prefix, title, imageUrl }) => (
          <ItemContainer key={id} onClick={() => navigateAndId(id)}>
            <ItemImg src={imageUrl} />
            <p>
              {prefix}. {name} {lastName}
            </p>
            <p>{title}</p>
          </ItemContainer>
        ))}
      </Container>
      {hasMore && (
        <div ref={elementRef}>
          <AnContainer>
            <FirstDiv></FirstDiv>
            <SecondDiv></SecondDiv>
            <ThirdDiv></ThirdDiv>
          </AnContainer>
        </div>
      )}
    </HomePageContainer>
  );
}
export default Home;

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: center;
  overflow-y: hidden;
`;

const Container = styled.div`
  display: grid;
  width: 1200px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  overflow-y: hidden;

  @media (max-width: 450px) {
    width: 400px;
    grid-template-columns: 1fr 1fr;
  }
`;

const ItemContainer = styled.div`
  height: 285px;
  margin: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
  padding-bottom: 5px;

  @media (max-width: 450px) {
    width: 170px;
    height: 200px;
  }
`;

const ItemImg = styled.img`
  width: 285px;
  height: 208px;
  @media (max-width: 450px) {
    width: 170px;
    height: 100px;
  }
`;

const AnContainer = styled.div`
  display: flex;
  justify-content: center;
  widht: 1200px;
  height: 70px;
  gap: 3px;

  position: relative;
`;

const rotate = keyframes`
0%{
    top:15px;
    height:64px;
}
50%, 100%{
    top:30px;
    height:32px;
}`;

const FirstDiv = styled.div`
  width: 16px;

  background-color: #006400;
  animation: ${rotate} 1s infinite;
  position: absolute;
  animation-delay: -0.24s;
  top: 0px;
  left: 580px;

  @media (max-width: 450px) {
    left: 170px;
  }
`;
const SecondDiv = styled.div`
  width: 16px;
  height: 32px;
  background-color: #006400;
  position: absolute;
  animation: ${rotate} 1s infinite;
  animation-delay: -0.12s;
  left: 600px;

  @media (max-width: 450px) {
    left: 190px;
  }
`;
const ThirdDiv = styled.div`
  width: 16px;
  height: 32px;
  background-color: #006400;
  animation: ${rotate} 1s infinite;
  animation-delay: -0.6s;
  position: absolute;
  left: 620px;

  @media (max-width: 450px) {
    left: 210px;
  }
`;
