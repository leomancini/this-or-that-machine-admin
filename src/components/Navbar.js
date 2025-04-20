import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faThumbsUp,
  faMicrochip,
  faImage,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const Nav = styled.nav`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 1rem;
  margin: 1rem 0 1rem 1rem;
  padding: 1rem;
  z-index: 1000;
  height: calc(100vh - 4rem);
  width: 16rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  line-height: 1.25;
  padding: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  flex: 1;
`;

const NavItem = styled.div`
  a {
    color: rgba(0, 0, 0, 0.5);
    font-size: 1.125rem;
    text-decoration: none;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    &:hover {
      color: rgba(0, 0, 0, 0.8);
      background-color: rgba(0, 0, 0, 0.04);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.1);
      transform: scale(0.95);
    }

    &.selected {
      color: rgba(0, 0, 0, 1);
      background-color: rgba(0, 0, 0, 0.06);
      font-weight: bold;
    }
  }
`;

const NavIcon = styled(FontAwesomeIcon)`
  font-size: 1.125rem;
  width: 1.25rem;
  height: 1.25rem;
`;

const LogoutSection = styled.div`
  margin-top: auto;
  padding-top: 1rem;
`;

const Navbar = () => {
  const location = useLocation();

  return (
    <Nav>
      <Header>
        <HeaderTitle>This or That Machine</HeaderTitle>
      </Header>
      <NavList>
        <NavItem>
          <Link
            to="/pairs"
            className={
              location.pathname === "/" || location.pathname === "/pairs"
                ? "selected"
                : ""
            }
          >
            <NavIcon icon={faLink} />
            Pairs
          </Link>
        </NavItem>
        <NavItem>
          <Link
            to="/votes"
            className={location.pathname === "/votes" ? "selected" : ""}
          >
            <NavIcon icon={faThumbsUp} />
            Votes
          </Link>
        </NavItem>
        <NavItem>
          <Link
            to="/simulator"
            className={location.pathname === "/simulator" ? "selected" : ""}
          >
            <NavIcon icon={faMicrochip} />
            Simulator
          </Link>
        </NavItem>
        <NavItem>
          <Link
            to="/test-sources"
            className={location.pathname === "/test-sources" ? "selected" : ""}
          >
            <NavIcon icon={faImage} />
            Test Sources
          </Link>
        </NavItem>
      </NavList>
      <LogoutSection>
        <NavItem>
          <Link
            to="/logout"
            className={location.pathname === "/logout" ? "selected" : ""}
            onClick={() => {
              localStorage.removeItem("apiKey");
              window.location.href = "/login";
            }}
          >
            <NavIcon icon={faSignOutAlt} />
            Logout
          </Link>
        </NavItem>
      </LogoutSection>
    </Nav>
  );
};

export default Navbar;
