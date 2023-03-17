import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { useContext, useEffect, useState, useRef } from "react";

function User() {
  const { value, setValue } = useContext(UserContext);
  const [users, setUsers] = useState();
  const [error, setError] = useState();
  const [friends, setFriends] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const elementRef = useRef(null);

  function navigateAndId(userId) {
    navigate(`/user/${userId}`);
    setValue({ id: userId });
    getMore();
  }

  function onIntersection(entries) {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      fetchList();
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
        setUsers(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, [value]);

  return <div></div>;
}

export default User;
