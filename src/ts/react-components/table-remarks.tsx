import * as React from "react";
import styled from "@emotion/styled";
import { FC, Fragment } from "react";

export const TableRemarks:FC<{remarks: remarks, direction: string}> = ({remarks, direction}) => {
  const {texts, ...remarkStyle} = remarks;
  const RemarkElements = texts.filter(
    (text) => {
      return text.isInbound && direction === '1' || text.isInbound === false && direction === '0'
    }
  ).map(
    (text, index) => {
      const RemarkText = styled(RemarkBase)`
        background: white;
        color: ${text.textColor};
        white-space: pre;
        writing-mode: ${text.isVertical ? 'vertical-rl' : 'horizontal-tb'};
      `

      const Remark = styled(RemarkWrapper)`
        position: absolute;
        left: ${text.x}px;
        top: ${text.y}px;
        font-family: ${remarkStyle.fontFamily};
        font-size: ${remarkStyle.fontSize}px;
        font-style: ${remarkStyle.isItalic ? 'oblique' : 'normal'};
        font-weight: ${remarkStyle.isBold ? 'bold' : 'normal'};
        line-height: 130%;
      `
      return <Remark key={`remark-${index}`}>
        <RemarkText>{text.content}</RemarkText>
      </Remark>
    }
  )
  return <Fragment>
    {RemarkElements}
  </Fragment>
}

const RemarkWrapper:FC<{className?:string}> = ({children, className}) => {
  return <div className={className}>{children}</div>
}

const RemarkBase:FC<{className?: string}> = ({children, className}) => {
  return <span className={className}>{children}</span>
}