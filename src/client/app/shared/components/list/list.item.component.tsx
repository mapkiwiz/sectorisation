import * as React from 'react';

export interface  ListItemProps<T> {
  id: number;
  item: T;
  renderItem: Function
}

export interface ListItemState {
  selected: boolean;
}

export class ListItem<T> extends React.Component<ListItemProps<T>, ListItemState> {

  static contextTypes = {
    store: React.PropTypes.object,
    state: React.PropTypes.func
  };

  context: any;
  dispose: Function;

  constructor(props: ListItemProps<T>, context: any) {
    super(props, context);
    this.state = this.mapContextToState();
  }

  mapContextToState() {
    let selected = this.context.state().selected.includes(this.props.id);
    if (this.state && selected === this.state.selected) {
      return this.state;
    } else {
      return { selected: selected };
    }
  }

  click(e: React.MouseEvent) {
    if (this.state.selected) {
      this.doAction(this.unselect());
    } else {
      this.doAction(this.select());
    }
    e.preventDefault();
  }

  dblclick(e: React.MouseEvent){
    this.doAction(this.selectOne());
    e.preventDefault();
  }

  doAction(action: {}) {
    this.context.store.dispatch(action);
  }

  select() {
    return { type: 'SELECT', id: this.props.id };
  }

  unselect() {
    return { type: 'UNSELECT', id: this.props.id };
  }

  selectOne() {
    return { type: 'SELECT_ONE', id: this.props.id };
  }

  componentDidMount() {
    this.dispose = this.context.store.subscribe(() => {
      // let selected = this.context.store.getState().selected.filter(i => (i == this.props.id)).length > 0;
      // let selected = this.context.store.getState().selected.includes(this.props.id);
      // if (selected !== this.state.selected)
      //   this.setState({ selected: selected });
      this.setState(this.mapContextToState());
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    let renderedItem = this.props.renderItem(this.props.item);
    return (
      <li className={ (this.state.selected)? 'selected':'' } onClick={ e => this.click(e) } onDoubleClick={ e => this.dblclick(e) }>
        <span class="glyphicon glyphicon-map-marker"></span>
        { renderedItem }
      </li>
    );
  }

}
