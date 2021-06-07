import styled from '@emotion/styled';
import { maxWidth } from '../../common/Theme';

export const StyledHeader = styled.div({
  minHeight: "300px",
  background: "#ea4d8f",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",

  [maxWidth(600)]: {
    padding: 0,
    minHeight: "150px",
  }
});

export const Logo = styled.img({
  maxWidth: "100px",
  maxHeight: "100px",
  margin: "20px",

  [maxWidth(600)]: {
    maxWidth: "50px",
    maxHeight: "50px",
    margin: "10px",
  }
});

export const H1 = styled.h1({
  margin: 0,
  padding: 0,
  fontWeight: 300,

  [maxWidth(600)]: {
    fontSize: "1.5em",
  }
});

export const H2 = styled(H1)({
  margin: "10px 0 0",
  fontWeight: 900,
  fontSize: "30px",

  [maxWidth(600)]: {
    marginTop: 0,
  }
});