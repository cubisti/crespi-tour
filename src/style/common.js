import styled from 'styled-components';
export const Title = styled.h1`
  padding: 0 2rem;
  font-weight: bold;
  font-family: helvetica;
`;
export const Subtitle = styled.h4`
  padding: 0 2rem;
  font-weight: bold;
  font-family: helvetica;
`;
export const Body = styled.div`
  padding: 0 2rem;
  font-size: 1.2rem;
  font-family: helvetica;
`;
export const Top = styled.div`
  visibility: inherit;
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 3;
`;
export const Button = styled.button`
  content: ${props => props.content};
  position: absolute;
  display: inherit;
  width: 2.5rem;
  height: 2.5rem;
  top: 2rem;
  right: 1.5rem;
  font-weight: 300;
  font-family: helvetica;
  border: none;
  outline: none;
  border-radius: 20px;
  font-size: 2rem;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.38);
  background-color: rgb(255, 255, 255);
`;
export const Root = styled.div`
  :empty {
    color: blue;
  }
`;
