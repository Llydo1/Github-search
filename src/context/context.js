import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const userUrl = "https://api.github.com/users/";
const rateUrl = "https://api.github.com/rate_limit";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [request, setRequest] = useState(0);
  const [error, setError] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(false);

  const fetchUser = async (user) => {
    setError({ show: false, message: "" });
    setLoading(true);
    const response = await axios(`${userUrl}${user}`).catch(function (error) {
      console.log(error.toJSON());
    });
    if (response) {
      const { data } = response;
      setGithubUser(data);
      // axios(data.repos_url).then((response) => setRepos(response.data));
      // axios(data.followers_url).then((response) => setFollowers(response.data));
      await Promise.allSettled([
        axios(data.repos_url),
        axios(data.followers_url),
      ]).then((response) => {
        const [repos, followers] = response;
        console.log([repos, followers]);
        if (repos.status === "fulfilled") setRepos(repos.value.data);
        if (followers.status === "fulfilled")
          setFollowers(followers.value.data);
      });
    } else {
      setError({ show: true, message: "Can not find that user!!" });
    }
    setLoading(false);
  };

  useEffect(() => {
    (() => {
      axios(rateUrl)
        .then(
          ({
            data: {
              rate: { remaining },
            },
          }) => {
            setRequest(remaining);
            if (remaining === 0) {
              setError({ show: true, message: "Rate limit exceed!!!" });
            }
          }
        )
        .catch((err) => console.log(err));
    })();
  }, [githubUser]);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        fetchUser,
        request,
        error,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
