import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { WebsitesV2 } from './WebsitesV2';
import timeline from './timeline.json';

const RemotionRoot = () => (
  <Composition
    id="AltrawareWebsitesV2"
    component={WebsitesV2}
    durationInFrames={timeline.duration_frames}
    fps={timeline.fps}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
);

registerRoot(RemotionRoot);

export default RemotionRoot;
