import * as React from 'react';
import {ListItem} from './list.item.component.tsx';
const tween = require('tween.js');

interface ListProps<T> {
  items: Array<T>;
  renderItem: Function;
  mapState: Function;
  scrollDelta: number;
}

export class List<T> extends React.Component<ListProps<T>, {}> {

  static defaultProps = {
    items: [],
    renderItem: (item: any) => item,
    mapState: (state: any) => state,
    scrollDelta: 10
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  static childContextTypes = {
    store: React.PropTypes.object,
    state: React.PropTypes.func
  };

  container: any;
  dispose: Function;
  context: any;

  constructor(props: ListProps<T>, context: any) {
    super(props, context);
  }

  getChildContext() {
    return {
      state: () => this.mapContextToState(),
      store: this.context.store
    };
  }

  mapContextToState() {
    return this.props.mapState(this.context.store.getState());
  }

  dispatch(action: any) {
    this.context.store.dispatch(action);
  }

  scrollTo(id: number) {
    let toElement: any = undefined;
    this.props.items.forEach((item, idx) => {
      if (item.id == id) {
        toElement = this.container.children[idx];
      }
    });
    if (toElement !== undefined) {
      let newScroll =
        toElement.offsetTop -
        // toElement.offsetHeight -
        this.props.scrollDelta -
        this.container.parentElement.offsetTop;
      console.log('Scroll to ' + newScroll);
      new tween.Tween(this.container.parentElement)
        .to({ scrollTop: newScroll }, 100)
        .start();
      let animate = () => {
        window.requestAnimationFrame(animate);
        tween.update();
      };
      animate();
      // this.container.parentElement.scrollTop = newScroll;
    }
  }

  componentDidMount() {
    this.dispose =
      this.context.store.subscribe(() => {
        let to = this.context.store.getState().scrollIndex;
        if (to)
          this.scrollTo(to);
      });
    // this.dockHeader();
  }

  componentDidUpdate() {
    // this.dockHeader();
  }

  componentWillUnmount() {
    this.dispose();
  }

  dockHeader() {
    let target: any = this.container.previousSibling;
    target.style.width = (target.clientWidth + 1) + 'px';
    target.style.position = 'absolute';
    this.container.style.marginTop = (target.clientHeight + 17) + 'px';
  }

  undockHeader() {
    let target: any = this.container.previousSibling;
    target.style.width = '';
    target.style.position = '';
    this.container.style.marginTop = '';
  }

  render() {
    let items = this.props.items.map(item => {
      return (
        <ListItem key={ item.id } id={ item.id } item={ item } renderItem={ this.props.renderItem }></ListItem>
      );
    });
    return (
      <div className="list-container">
        { this.props.children }
        <ul className="list" ref={ (ref) => this.container = ref }>
          { items }
        </ul>
      </div>
    );
  }

}
