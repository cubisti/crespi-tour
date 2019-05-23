import React, { createElement, useState } from 'react';
import {
  Container,
  LeftMessage,
  RightMessage,
  PaddedDiv,
  Emoji,
} from '../../style/description';
import { Title, Subtitle, Body as NormalBody } from '../../style/common';
import { PhotoSphere } from '../functions/photo';
import { Body } from '../functions/body';
import { Video } from '../functions/video';
import { BidimensionalPhoto } from '../functions/bidimensionalPhoto';
import ContainerDimensions from 'react-container-dimensions';
import { TopPhoto } from '../functions/topPhoto';
export const Cimitero = props => {
  return (
    <div>
      <TopPhoto name={props.name} filename={'3'} />
      <Title>{props.title}</Title>
      <Emoji>👇🏼</Emoji>
      <PaddedDiv>
        <NormalBody>
          <Body filename={'1'} name={props.name} language={props.language} />
          <PhotoSphere name={props.name} filename={'1'} />
          <Body filename={'2'} name={props.name} language={props.language} />
          <PhotoSphere name={props.name} filename={'2'} />
          <Body filename={'3'} name={props.name} language={props.language} />
        </NormalBody>
      </PaddedDiv>
    </div>
  );
};
