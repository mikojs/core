// @flow

type arguType = {| collect: (monitor: {}) => {} |};
type returnType = [{}, () => void, () => void];

/** mock react-dnd-cjs */
class ReactDndCjs {
  drag: {};

  drop: {};

  monitor = {};

  /**
   * @example
   * reactDndCjs.useDrag({})
   *
   * @param {object} drag - drag config
   *
   * @return {Array} - drag result
   */
  +useDrag = (drag: arguType): returnType => {
    this.drag = drag;

    return [drag.collect(this.monitor), jest.fn(), jest.fn()];
  };

  /**
   * @example
   * reactDndCjs.useDrop({})
   *
   * @param {object} drop - drop config
   *
   * @return {Array} - drop result
   */
  +useDrop = (drop: arguType): returnType => {
    this.drop = drop;

    return [drop.collect(this.monitor), jest.fn(), jest.fn()];
  };
}

export const { DndContext, DndProvider, useDragLayer } = jest.requireActual(
  'react-dnd-cjs',
);
export const reactDndCjs = new ReactDndCjs();
export const { useDrag, useDrop } = reactDndCjs;
