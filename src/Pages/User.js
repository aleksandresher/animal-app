import { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function User() {
  const { value, setValue } = useContext(UserContext);
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [friends, setFriends] = useState([]);
  const [inintialFriends, setInitialFriends] = useState([]);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const elementRef = useRef(null);

  function navigateAndId(userId) {
    navigate(`/user/${userId}`);
    setValue({ id: userId });
  }

  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      // setPage((prevPage) => prevPage + 1);
      fetchMoreItems();
      // setPage((prev) => prev + 1);
    }
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
  }, [friends]);

  useEffect(() => {
    axios
      .get(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${value.id}`
      )
      .then((res) => {
        setUser(res.data);
        setItems((prev) => [...prev, res.data]);
        // setItems(res.data);
        // setFriendLink((prev) => prev?.prev.push(res.data));
      })
      .catch((err) => {
        setError(err);
      });
  }, [value]);

  useEffect(() => {
    axios
      .get(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${value.id}/friends/${page}/12`
      )
      .then((res) => {
        setInitialFriends(res.data.list);
      })
      .catch((err) => {
        setError(err);
      });
  }, [value]);

  async function fetchMoreItems() {
    try {
      const response = await fetch(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${value.id}/friends/${page}/12`
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      if (data.list.length === 0) {
        setHasMore(false);
      } else {
        setFriends((prevFriends) => [...prevFriends, ...data.list]);

        setInitialFriends(friends);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  console.log(items);

  return (
    <UserInfoContainer>
      <UserContainer key={user?.id}>
        <UserImg src={user?.imageUrl} />
        <FieldSetContainer>
          <legend>info</legend>
          <strong>
            {user?.prefix} {user?.name} {user?.lastName} {value.id}
          </strong>
          <UserInfoParagraph>{user?.title}</UserInfoParagraph>
          <InfoSubContainer>
            <p>Email</p>
            <UserInfoParagraph>{user?.email}</UserInfoParagraph>
          </InfoSubContainer>
          <InfoSubContainer>
            <p>Ip Adress:</p>
            <UserInfoParagraph>{user?.ip}</UserInfoParagraph>
          </InfoSubContainer>
          <InfoSubContainer>
            <p>Job Area:</p>
            <UserInfoParagraph>{user?.jobArea}</UserInfoParagraph>
          </InfoSubContainer>
          <InfoSubContainer>
            <p>Job Type:</p>
            <UserInfoParagraph>{user?.jobType}</UserInfoParagraph>
          </InfoSubContainer>
        </FieldSetContainer>
        <RightFieldset>
          <legend>Adress</legend>
          <strong>{user?.company.name}</strong>
          <InfoSubContainer>
            <p>City:</p>
            <UserInfoParagraph>{user?.address.city}</UserInfoParagraph>
          </InfoSubContainer>
          <InfoSubContainer>
            <p>Country:</p>
            <UserInfoParagraph>{user?.address.country}</UserInfoParagraph>
          </InfoSubContainer>
          <InfoSubContainer>
            <p>State:</p>
            <UserInfoParagraph>{user?.address.state}</UserInfoParagraph>
          </InfoSubContainer>
          <AdressContainer>
            <p>Street Adress: {user?.address.streetAddress}</p>
          </AdressContainer>
          <ZipInfoContainer>Zip:{user?.address.zipCode}</ZipInfoContainer>
        </RightFieldset>
      </UserContainer>
      <FriendLinks>
        <LinkDiv>
          {items?.map(({ id, name, lastName, prefix, idx }) => (
            <div key={idx}>
              <p onClick={() => setValue({ id: id })} key={idx}>
                {prefix}
                {name}
                {lastName}
              </p>
            </div>
          ))}
        </LinkDiv>
      </FriendLinks>
      <h1>Friends</h1>
      <Container>
        {inintialFriends?.map((friend) => (
          <ItemContainer
            key={friend.id}
            onClick={() => navigateAndId(friend.id, friend)}
          >
            <FriendImg src={friend.imageUrl} />
            <p>
              {friend.prefix}. {friend.name} {friend.lastName}
            </p>
            <p>{friend.title}</p>
          </ItemContainer>
        ))}
      </Container>
      {hasMore && (
        <div ref={elementRef}>
          {" "}
          <AnContainer>
            <FirstDiv></FirstDiv>
            <SecondDiv></SecondDiv>
            <ThirdDiv></ThirdDiv>
          </AnContainer>
        </div>
      )}
    </UserInfoContainer>
  );
}

export default User;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1200px;
  border: 1px solid #ccc;
  padding: 40px 15px 0px 15px;
  overflow: hidden;
`;

const LinkDiv = styled.div`
  display: flex;
  gap: 15px;
`;

const FriendLinks = styled.div`
  display: flex;
  width: 1200px;
`;
const Container = styled.div`
  display: grid;
  width: 1200px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 20px;
  overflow: hidden;

  @media (max-width: 450px) {
    width: 400px;
    gap: 5px;
    grid-template-columns: 1fr 1fr;
  }
`;
const UserContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  justify-content: center;
  width: 1200px;
  gap: 10px;
  overflow: hidden;

  @media (max-width: 450px) {
    display: flex;
    flex-direction: column;
  }
`;

const FieldSetContainer = styled.fieldset`
  height: 211px;
  width: 647px;
  gap: 5px;
  border-color: rgb(192, 192, 192);
  padding-left: 10px;
  margin-top: 0px;

  @media (max-width: 450px) {
    width: 350px;
  }
`;

const UserImg = styled.img`
  width: 266px;
  height: 200px;
  margin-top: 10px;

  @media (max-width: 450px) {
    width: 378px;
    height: 300px;
  }
`;

const FriendImg = styled.img`
  width: 266px;
  height: 200px;
  margin-top: 10px;

  @media (max-width: 450px) {
    width: 170px;
    height: 120px;
    margin-top: 0px;
  }
`;

const InfoSubContainer = styled.div`
  display: flex;
  gap: 5px;
  overflow-wrap: break-word;
  margin: 0px;
  height: 25px;
`;
const RightFieldset = styled.fieldset`
  width: 191px;
  height: 220px;

  @media (max-width: 450px) {
    width: 350px;
  }
`;
const UserInfoParagraph = styled.p`
  overflow-wrap: break-word;
`;
const ItemContainer = styled.div`
  height: 285px;

  cursor: pointer;
  border: 1px solid #ccc;

  @media (max-width: 450px) {
    width: 170px;
    height: 220px;
    padding-bottom: 5px;
  }
`;

const ItemImg = styled.img`
  width: 285px;
  height: 208px;
`;
const AdressContainer = styled.div`
  height: 43px;
`;
const ZipInfoContainer = styled.div`
  margin-bottom: 10px;
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
  left: 600px;
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
  left: 620px;
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
  left: 640px;

  @media (max-width: 450px) {
    left: 210px;
  }
`;
