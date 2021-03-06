import React, { Component } from "react";
import PropTypes from "prop-types";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate } from "react-day-picker/moment";

const DEFAULT_UPDATE_DELAY = 100;

function normalizeDay(day, format) {
  if (day === undefined) {
    return undefined;
  } else if (format === "date-time") {
    return day.toISOString();
  } else if (format === "date") {
    return day.toISOString().substr(0, 10);
  }
}

export default class ReactDatePicker extends Component {
  constructor(props) {
    super(props);

    let { formData } = props;

    this.day = formData ? new Date(formData) : undefined;
  }

  componentWillReceiveProps({ formData }) {
    if (formData) {
      this.day = new Date(formData);
    }
  }

  handleKeyDown = evt => {
    if (evt.keyCode === 13) {
      this.refs.datePicker.getInput().blur();
      this.notifyChange();
    }
  };

  handleBlur = () => {
    let {
      uiSchema: { rdp: { updateDelay = DEFAULT_UPDATE_DELAY } = {} } = {},
    } = this.props;
    setTimeout(this.notifyChange, updateDelay);
  };

  notifyChange = () => {
    let day = this.day;
    let { schema: { format = "date-time" }, onChange, formData } = this.props;
    let event = normalizeDay(day, format);
    if (event !== formData) {
      onChange(event);
    }
  };

  handleDayChange = day => {
    this.day = day;
  };

  render() {
    let { uiSchema = {}, formData, idSchema: { $id } = {} } = this.props;
    let { rdp = {} } = uiSchema;
    let dayPickerInputProps = Object.assign(
      {
        onDayChange: this.handleDayChange,
        value: formData ? new Date(formData) : undefined,
        hideOnDayClick: true,
        ref: "datePicker",
        format: "YYYY-MM-DD",
        formatDate,
        inputProps: {
          className: "form-control",
          type: "text",
          autoFocus: uiSchema["ui:autofocus"],
        },
      },
      rdp
    );
    dayPickerInputProps.inputProps.onBlur = this.handleBlur;

    return (
      <div onKeyDown={this.handleKeyDown} id={$id}>
        <DayPickerInput {...dayPickerInputProps} />
      </div>
    );
  }
}

ReactDatePicker.propTypes = {
  schema: PropTypes.shape({
    format: PropTypes.oneOf(["date-time", "date"]),
  }),
};
