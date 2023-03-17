import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import UserContext from "../context/UserContext";

function Home() {
  //   const [items, setItems] = useState([
  //     { id: 1, name: "Item 1" },
  //     { id: 2, name: "Item 2" },
  //     { id: 3, name: "Item 3" },
  //   ]);

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

  const { value, setValue } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState();
  const [size, setSize] = useState(10);

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
    <div>
      {/* {items.map((item) => ( */}
      {/* //     <div key={item.id}>
    //       <p>{item.name}</p>
    //       <button onClick={() => updateItem(item.id)}>Update</button>
    //     </div> */}
      {/* //   ))} */}
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
        {hasMore && <div ref={elementRef}>load more Items</div>}
      </Container>
    </div>
  );
}
export default Home;

const Container = styled.div`
  display: grid;
  width: 1200px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const ItemContainer = styled.div`
  height: 285px;
  margin: 10px;
  cursor: pointer;
  border: 1px solid #ccc;
`;

const ItemImg = styled.img`
  width: 285px;
  height: 208px;
`;
