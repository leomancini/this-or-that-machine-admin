import React from "react";
import Page from "../components/Page";
import Image from "../assets/DevicePhoto.png";
import styled from "styled-components";

const DevicePhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Device = () => {
  return (
    <Page style={{ fontSize: 0 }}>
      <DevicePhoto src={Image} alt="This or That Machine" />
    </Page>
  );
};

export default Device;
