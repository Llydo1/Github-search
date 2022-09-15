import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";
const userUrl = "https://api.github.com/users/";
const rateUrl = "https://api.github.com/rate_limit";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [request, setRequest] = useState(0);
  const [error, setError] = useState({ show: false, message: "" });

  const fetchUser = async (user) => {
    const { data } = await axios(`${userUrl}${user}`).catch(function (error) {
      console.log(error.toJSON());
    });
    if (data) {
      setGithubUser(data);
      setRepos((await axios(data.repos_url)).data);
      setFollowers((await axios(data.followers_url)).data);
    }
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
            setRequest(0);
            if (request === 0) {
              setError({ show: true, message: "Rate limit exceed!!!" });
            }
          }
        )
        .catch((err) => console.log(err));
    })();
  }, [githubUser]);
  return (
    <GithubContext.Provider
      value={{ githubUser, repos, followers, fetchUser, request, error }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
