/** @jsxImportSource @motion-canvas/2d */
import { createRef, linear, makeProject, tween } from '@motion-canvas/core';
import { makeScene2D, Rect, Txt } from '@motion-canvas/2d';

const scene = makeScene2D(function* (view) {
  const bar = createRef<Rect>();
  view.fill('#071022');
  view.add(
    <>
      <Txt
        y={-220}
        fontFamily={'Arial, Helvetica, sans-serif'}
        fontSize={52}
        fontWeight={700}
        fill={'#f7f6f2'}
        text={'MOTION CANVAS CORE OK'}
      />
      <Txt
        y={-150}
        fontFamily={'monospace'}
        fontSize={20}
        fill={'#a3aecb'}
        text={'3.17.2 · esbuild bundle proof'}
      />
      <Rect ref={bar} width={240} height={14} radius={7} fill={'#eab308'} x={-240} y={120} />
    </>,
  );
  yield* tween(1.5, (value) => {
    bar().position.x(linear(value, -240, 240));
  });
});

export default makeProject({
  name: 'altraware-motion-canvas-trial',
  scenes: [scene as any],
});
