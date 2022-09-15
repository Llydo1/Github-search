import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);
  //language data
  const languages = Object.values(
    repos.reduce((total, item) => {
      const { language } = item;
      if (!language) return total;
      if (!total[language]) {
        total[language] = { label: language, value: 1 };
      } else {
        total[language].value++;
      }
      return total;
    }, {})
  ).sort((a, b) => b.value - a.value);

  //Stars per language
  const languageStars = Object.values(
    repos.reduce((total, item) => {
      const { language, stargazers_count } = item;
      if (!language) return total;
      if (!total[language]) {
        total[language] = { label: language, value: stargazers_count };
      } else {
        total[language].value = total[language].value + stargazers_count;
      }
      return total;
    }, {})
  ).sort((a, b) => b.value - a.value);

  //Repo star data
  const mostStars = repos
    .map((repo) => {
      return { label: repo.name, value: repo.stargazers_count };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  //Most Fork
  const mostFork = repos
    .map((repo) => {
      return { label: repo.name, value: repo.forks_count };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={languages} />
        <Column3D data={mostStars} />
        <Doughnut2D data={languageStars} />
        <Bar3D data={mostFork} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
