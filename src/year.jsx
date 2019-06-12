import PropTypes from 'prop-types';
import React from 'react';
import $ from 'jquery';
import CustomPropTypes from './utils/custom_prop_types';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

class YearBase extends React.Component {
  constructor(props) {
    super(props);

    this.selectMonthFn = this.selectMonth.bind(this);
    this.reduceYear = this.changeYear.bind(this, -1);
    this.incYear = this.changeYear.bind(this, 1);

    this.state = {
      currYear: this.props.currYear.format('YYYY'),
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ currYear: nextProps.currYear.format('YYYY') });
  }
  changeYear(n) {
    const year = this.state.currYear;
    // check the min and max date;
    if ((n < 0 && year === this.props.restrictionRange.start.format('YYYY')) ||
    (n > 0 && year === this.props.restrictionRange.end.format('YYYY'))) {
      return false;
    }

    this.props.currYear.add(n, 'y');
    const currYear = this.props.currYear.format('YYYY');

    if (this.props.onYearChange) {
      this.props.onYearChange(currYear);
    }

    this.setState({ currYear });
    return true;
  }
  selectMonth(e) {
    e.preventDefault();
    e.stopPropagation();
    const target = $(e.currentTarget).children().first();
    const selectedMonth = parseInt(target.data('idx'), 10);
    // this is either start or end of the moment range
    this.datePoint.month(selectedMonth).year(this.state.currYear);
    // passing selectedDateRange because the app should get the range rather
    // than start or end of the range.
    // this.datePoint is a reference to the prop selectedDateRange
    this.props.onSelect(this.props.selectedDateRange, this.datePoint);
  }
  render() {
    const currYear = this.state.currYear;
    const selectedRange = this.props.selectedDateRange;
    const restrictionRange = this.props.restrictionRange;
    const newDate = new Date();

    newDate.setYear(currYear);
    newDate.setDate(1);
    const months = MONTHS.map((month, idx) => {
      newDate.setMonth(idx);
      let selection = '';
      if (!restrictionRange.contains(newDate, false)) {
        selection = 'disabled';
      } else if (this.props.monthClass) {
        selection = this.props.monthClass(newDate);
      } else if (currYear === this.datePoint.format('YYYY') && month === this.datePoint.format('MMM')) {
        selection = 'selected';
      } else if (selectedRange && selectedRange.contains(newDate, true)) {
        selection = 'highlight';
      }

      return (
        <span key={Date.now() + idx} className={`${selection} month`} onClick={selection === 'disabled' ? () => {} : this.selectMonthFn}>
          <button
            className="cal-month btn btn-plain"
            data-idx={idx}
            data-month={month}
          >
            {month}
          </button>
        </span>
      );
    }, this);

    return (
      <div>
        <div className="head">
          <h4 className="title clearfix">
            <button
              className="btn btn-plain year-down pull-left"
              onClick={this.reduceYear}
            >
              <i className="fa fa-chevron-circle-left" />
            </button>
            {currYear}
            <button
              className="btn btn-plain year-up pull-right"
              onClick={this.incYear}
            >
              <i className="fa fa-chevron-circle-right" />
            </button>
          </h4>
        </div>
        <div className="months">
          <div className="clearfix">
            {months}
          </div>
        </div>
      </div>
    );
  }
}

YearBase.propTypes = {
  restrictionRange: CustomPropTypes.MomentRangeType.isRequired,
  currYear: CustomPropTypes.MomentType.isRequired,
  selectedDateRange: CustomPropTypes.MomentRangeType,
  onYearChange: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  monthClass: PropTypes.func,
};

class YearStart extends YearBase {
  constructor(props) {
    super(props);
    this.datePoint = this.props.selectedDateRange.start;
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.datePoint = nextProps.selectedDateRange.start;
    super.UNSAFE_componentWillReceiveProps(nextProps);
  }
}

class YearEnd extends YearBase {
  constructor(props) {
    super(props);
    this.datePoint = this.props.selectedDateRange.end;
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.datePoint = nextProps.selectedDateRange.end;
    super.UNSAFE_componentWillReceiveProps(nextProps);
  }
}

class YearBoth extends YearBase {
  constructor(props) {
    super(props);
    this.datePoint = props.currYear;
  }
}

export {
  YearStart,
  YearEnd,
  YearBoth,
};
