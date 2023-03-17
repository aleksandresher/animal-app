import { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function User() {
  const { value, setValue } = useContext(UserContext);
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [friends, setFriends] = useState([]);
  const [num, setNum] = useState(null);
  const [inintialFriends, setInitialFriends] = useState([]);
  const [previousPath, setPreviousPath] = useState(null);
  const location = useLocation();
  const [items, setItems] = useState([]);
  // console.log(user);

  const [friendLink, setFriendLink] = useState([]);
  console.log(friendLink);

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const elementRef = useRef(null);

  function navigateAndId(userId, friend) {
    navigate(`/user/${userId}`);
    setValue({ id: userId });
    // const newArray = [...items, ...friend];
    // setItems(newArray);

    // let newObj = friend;
    // const newArray = [...items, newObj];
    // setItems(newArray);

    // fetchMoreItems();
    // getMore();
    help(userId);
    console.log(value);
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
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${value.id}/friends/${page}/10`
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
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${value.id}/friends/${page}/10`
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

  function help(id) {
    axios
      .get(
        `http://sweeftdigital-intern.eu-central-1.elasticbeanstalk.com/user/${id}`
      )
      .then((res) => {
        setFriendLink(res.data.list);
        // setFriendLink((prev) => prev?.prev.push(res.data));
      })
      .catch((err) => {
        setError(err);
      });
  }

  //   function getMore() {
  //     setFriendLink((prev) => [...prev, user]);
  //   }

  console.log(items);

  //   const [items, setItems] = useState({user?.map((user) => {
  //     id: user.id, name: user.name
  //   })})

  //   const updateItem = (itemId, newName) => {
  //     // Create a new array with the updated object
  //     const updatedItems = items.map((item) => {
  //       if (item.id === itemId) {
  //         return { ...item, id: itemId, name: item.name };
  //       }
  //       return item;
  //     });

  //     // Update the state with the new array
  //     setItems(updatedItems);
  //   };

  //   const updateItems = (item) => {
  //     setItems(item);
  //   };
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
          <InfoSubContainer>
            <p>Street Adress:</p>
            <UserInfoParagraph>{user?.address.streetAddress}</UserInfoParagraph>
          </InfoSubContainer>
          <InfoSubContainer>
            <p>Zip:</p>
            <UserInfoParagraph>{user?.address.zipCode}</UserInfoParagraph>
          </InfoSubContainer>
        </RightFieldset>
      </UserContainer>
      <FriendLinks>
        <LinkDiv>
          {items?.map(({ id, name, lastName }) => (
            <div key={id}>
              <a href={`/user/${id}`}>
                {name}
                {lastName}
              </a>
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
            <ItemImg src={friend.imageUrl} />
            <p>
              {friend.prefix}. {friend.name} {friend.lastName}
            </p>
            <p>{friend.title}</p>
          </ItemContainer>
        ))}
        {hasMore && <div ref={elementRef}>load more Items</div>}
      </Container>
    </UserInfoContainer>
  );
}

export default User;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1200px;
  border: 1px solid #0b0b0b;
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
  overflow: scroll;
  overflow-y: scroll;
`;
const UserContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  justify-content: center;
  width: 1158px;
`;

const FieldSetContainer = styled.fieldset`
  height: 211px;
  gap: 5px;
  border-color: rgb(192, 192, 192);
  padding: 0px;
  margin-top: 0px;
`;

const UserImg = styled.img`
  width: 266px;
  height: 200px;
`;

const InfoSubContainer = styled.div`
  display: flex;
  gap: 5px;
  overflow-wrap: break-word;
  height: 30px;
`;
const RightFieldset = styled.fieldset`
  width: 164px;
  height: 215px;
`;
const UserInfoParagraph = styled.p`
  overflow-wrap: break-word;
`;
const ItemContainer = styled.div`
  height: 285px;

  cursor: pointer;
  border: 1px solid #ccc;
`;

const ItemImg = styled.img`
  width: 285px;
  height: 208px;
`;
