import { css, type CSSObject } from "styled-components";

export const mobile = (props: CSSObject | string) => {
  return css`
    @media only screen and (max-width: 700px) {
      ${props}
    }
  `;
};
