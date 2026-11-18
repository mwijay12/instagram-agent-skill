/** @jsxImportSource @revideo/2d */
import { createRef, linear, makeProject, tween } from '@revideo/core';
import { makeScene2D, Rect, Txt } from '@revideo/2d';

const scene = makeScene2D('altraware-engine-trial', function* (view) {
  const bar = createRef<Rect>();
  const chip = createRef<Rect>();

  view.fill('#071022');
  view.add(
    <>
      <Txt
        x={0}
        y={-220}
        fontFamily={'Arial, Helvetica, sans-serif'}
        fontSize={54}
        fontWeight={700}
        fill={'#f7f6f2'}
        text={'REVIDEO OK'}
      />
      <Txt
        x={0}
        y={-150}
        fontFamily={'monospace'}
        fontSize={22}
        fill={'#a3aecb'}
        text={'0.11.0 · CHROMIUM 153 · MP4'}
      />
      <Rect
        ref={bar}
        width={240}
        height={14}
        radius={7}
        fill={'#eab308'}
        y={120}
        x={-260}
      />
      <Rect
        ref={chip}
        width={120}
        height={120}
        radius={26}
        fill={'#7c3aed'}
        rotation={-12}
        x={0}
        y={330}
      />
    </>,
  );

  yield* tween(2, (value) => {
    bar().position.x(linear(value, -260, 260));
    bar().rotation(linear(value, -8, 8));
    chip().scale(linear(value, 0.75, 1.25));
    chip().rotation(linear(value, -12, 18));
  });
});

export default makeProject({
  name: 'altraware-revideo-trial',
  scenes: [scene],
  settings: {
    shared: {
      size: { x: 540, y: 960 },
      background: '#071022',
      range: [0, 2],
    },
    rendering: {
      fps: 30,
      exporter: {
        name: '@revideo/core/ffmpeg',
        options: { format: 'mp4' },
      },
    },
  },
});
