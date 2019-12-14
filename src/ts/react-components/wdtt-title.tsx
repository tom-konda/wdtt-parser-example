import * as React from "react";
import styled from "@emotion/styled";
import { FC } from "react";

const WdttMainTitleBase : FC<{className: string, color: string, mainTitle: fontStyleMergedType<{ text: string; }>, width:number}> =
({className, mainTitle}) => {
  return <h1 className={className}>{mainTitle.text}</h1>
}

export const WdttMainTitle = styled(WdttMainTitleBase)`
  text-align: center;
  color: ${props => props.color};
  font-size: ${props => props.mainTitle.fontSize}px;
  font-family: ${props => props.mainTitle.fontFamily};
  font-style: ${props => props.mainTitle.isItalic ? 'oblique' : 'normal'};
  font-weight: ${props => props.mainTitle.isBold  ? 'bold' : 'normal'};
  width: ${props => props.width}px;
`

const TimetableSubTitleText : FC<{className: string, color: string, title: fontStyleMergedType<{texts: string[]}>, index: number}>=
({className, index, title}) => {
  return <h2 className={className}>{title.texts[index]}</h2>
}

const TimetableSubTitle = styled(TimetableSubTitleText)`
  color: ${props => props.color};
  font-size: ${props => props.title.fontSize}px;
  font-family: ${props => props.title.fontFamily};
  font-style: ${props => props.title.isItalic ? 'oblique' : 'normal'};
  font-weight: ${props => props.title.isBold  ? 'bold' : 'normal'};
`;

const WdttSubTitleSectionWrapper:FC<{className?:string}> = ({className, children}) => {
  return <section className={className}>{children}</section>
}

const WdttSubTitleSectionBase:FC<{className: string, color: string, title: fontStyleMergedType<{texts: string[]}>, width: number}> = ({className, color, title}) => {
  return <WdttSubTitleSectionWrapper className={className}>
    <TimetableSubTitle className="timetable__modify-date" color={color} title={title} index={1} />
    <TimetableSubTitle className="timetable__supervisor" color={color} title={title} index={0} />
  </WdttSubTitleSectionWrapper>
}

export const WdttSubTitleSection = styled(WdttSubTitleSectionBase)`
  display: flex;
  justify-content: space-between;
  width: ${props => props.width}px;
`;