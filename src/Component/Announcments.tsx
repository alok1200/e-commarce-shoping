import styled, { keyframes } from "styled-components";
import React, { useState, useEffect } from "react";
import { publicRequest } from "../axiosReqMethods.js";

const marqueeAnimation = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const Container = styled.div`
  min-height: 40px;
  background-color: teal;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const MarqueeText = styled.div`
  white-space: nowrap;
  animation: ${marqueeAnimation} 15s linear infinite;
`;

interface Announcement {
  title: string;
  [key: string]: string | number | boolean;
}

const Announcments: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await publicRequest.get("/api/announcment");
        setAnnouncement(res.data);
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  return (
    <>
      {announcement && (
        <Container>
          <MarqueeText>{announcement.title}</MarqueeText>
        </Container>
      )}
    </>
  );
};

export default Announcments;
