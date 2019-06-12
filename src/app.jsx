import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import CustomPropTypes from './utils/custom_prop_types';
import Picker from './picker';
import Calendar from './calendar';
import { YearBoth } from './year';

require('moment-range');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickFn = this.handleClick.bind(this);
    this.onSelectFn = this.onSelect.bind(this);
    this.onApplyFn = this.onApply.bind(this);
    this.onCancelFn = this.onCancel.bind(this);

    const { selectedDateRange, restrictionRange, display } = props;
    this.state = { selectedDateRange, restrictionRange, display };
    this.selectedDateRange = selectedDateRange.clone();
  }
  componentDidMount() {
    if (this.props.onRender) {
      this.props.onRender();
    }
  }
  onApply() {
    if (this.props.onApply) {
      this.props.onApply(this.selectedDateRange);
    }

    // what ever was selected currently gets applied
    this.state.selectedDateRange = this.selectedDateRange;

    this.state.display = false;
    this.setState(this.state);
  }
  onCancel() {
    this.state.display = false;
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState(this.state);
  }
  onSelect(newDateRange) {
    // so that if the user clicks cancel it doesn't change.
    this.selectedDateRange = newDateRange.clone();

    if (this.props.onSelect) {
      this.props.onSelect(this.selectedDateRange);
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const localState = Object.assign({}, this.state, nextProps);
    this.setState(localState);
  }
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.display) {
      return;
    }
    this.state.display = true;
    this.setState(this.state);
  }
  render() {
    return (
      <div className="month-picker">
        <Picker
          selectedDateRange={this.state.selectedDateRange.clone()} onClick={this.handleClickFn}
        />
        <Calendar
          selectedDateRange={this.state.selectedDateRange.clone()}
          restrictionRange={this.state.restrictionRange.clone()}
          display={this.state.display}
          onSelect={this.onSelectFn}
          onApply={this.onApplyFn}
          onCancel={this.onCancelFn}
          direction={this.props.direction}
          onYearChange={this.props.onYearChange}
          position={this.props.position}
        />
      </div>
    );
  }
}

App.propTypes = {
  selectedDateRange: CustomPropTypes.MomentRangeType,
  restrictionRange: CustomPropTypes.MomentRangeType,
  onYearChange: PropTypes.func,
  onRender: PropTypes.func, // called after the initial render of the
  onSelect: PropTypes.func,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  display: PropTypes.bool,
  direction: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
  position: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
};

const date = new Date();
const startDate = new Date(date.getFullYear(), 0, 1);
const endDate = new Date(date.getFullYear(), 11, 31);
const minDate = new Date(2000, 0, 1);
const maxDate = new Date(date.getFullYear() + 4, 11, 31);


App.defaultProps = {
  selectedDateRange: moment.range(startDate, endDate),
  restrictionRange: moment.range(minDate, maxDate),
  display: false,
  direction: 'bottom',
};

export default App;
export { Calendar, YearBoth };
