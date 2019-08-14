// @flow

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
  +useDrag = (drag: { collect: (monitor: {}) => {} }): [{}, () => void] => {
    this.drag = drag;

    return [drag.collect(this.monitor), jest.fn()];
  };

  /**
   * @example
   * reactDndCjs.useDrop({})
   *
   * @param {object} drop - drop config
   *
   * @return {Array} - drop result
   */
  +useDrop = (drop: {}): [void, () => void] => {
    this.drop = drop;

    return [undefined, jest.fn()];
  };
}

export const { DndContext, DndProvider } = jest.requireActual('react-dnd-cjs');
export const reactDndCjs = new ReactDndCjs();
export const { useDrag, useDrop } = reactDndCjs;
